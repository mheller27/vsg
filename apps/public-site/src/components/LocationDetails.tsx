import { useEffect, useState } from 'react';
import { EnhancedLocation } from '@shared-types';

interface LocationDetailsProps {
  location: EnhancedLocation;
}

interface Unit {
  price: string;
  beds: number;
  interior_sqft: number;
}

interface PropertyInfo {
  metadata: {
    price?: string;
    bedrooms?: string;
    sqft?: string;
  };
  units?: Unit[];
}

const LocationDetails = ({ location }: LocationDetailsProps) => {
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);



  const getPriceRange = (units: Unit[]) => {
    const validPrices = units
      .map(unit => unit.price)
      .filter(price => price && price !== 'Contact us' && price !== 'null')
      .map(price => parseFloat(price!.replace(/[$,]/g, '')))
      .filter(price => !isNaN(price)) as number[];

    if (validPrices.length === 0) return 'Contact us for pricing';

    const min = Math.min(...validPrices);
    const max = Math.max(...validPrices);

    const formatPrice = (price: number) => `$${price.toLocaleString()}`;
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  const getBedroomRange = (units: Unit[]) => {
    const beds = units.map(unit => unit.beds).filter(Boolean) as number[];
    if (beds.length === 0) return 'N/A';
    const min = Math.min(...beds);
    const max = Math.max(...beds);
    return min === max ? `${min} Beds` : `${min} - ${max} Beds`;
  };

  const getSqftRange = (units: Unit[]) => {
    const sqfts = units.map(unit => unit.interior_sqft).filter(Boolean) as number[];
    if (sqfts.length === 0) return 'N/A';
    const min = Math.min(...sqfts);
    const max = Math.max(...sqfts);
    const formatSqft = (sqft: number) => sqft.toLocaleString();
    return min === max ? formatSqft(min) : `${formatSqft(min)} - ${formatSqft(max)}`;
  };

  useEffect(() => {
    const slug = location.id;
    fetch(`/data/properties/${slug}/property-info.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load property info');
        return res.json();
      })
      .then((data) => setPropertyInfo(data))
      .catch(() => setPropertyInfo(null));
  }, [location.id]);


  if (propertyInfo?.metadata || propertyInfo?.units) {
    const { metadata, units = [] } = propertyInfo;

    const price = metadata?.price || getPriceRange(units);
    const bedrooms = metadata?.bedrooms || getBedroomRange(units);
    const sqft = metadata?.sqft || getSqftRange(units);

    return (
      <div className="flex flex-col gap-0.5">
        <div className="text-gray-600 text-sm m-0 p-0">{price}</div>
        <div className="text-gray-600 text-sm m-0 p-0">{bedrooms}</div>
        <div className="text-gray-600 text-sm m-0 p-0">{sqft}</div>
      </div>
    );
  }

  return (
    <p className="text-gray-600 mt-1">
      {location.description}
    </p>
  );
};

export default LocationDetails;