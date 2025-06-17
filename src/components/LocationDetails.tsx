
import { EnhancedLocation } from '../types';
import { locationDetails } from '../data/communities';

interface LocationDetailsProps {
  location: EnhancedLocation;
}

const LocationDetails = ({ location }: LocationDetailsProps) => {
  const details = locationDetails[location.id];
  
  if (details) {
    return (
      <div className="flex flex-col gap-1">
        <div className="text-gray-600">{details.price}</div>
        <div className="text-gray-600">{details.bedrooms}</div>
        <div className="text-gray-600">{details.sqft}</div>
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
