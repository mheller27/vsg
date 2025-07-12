
import { EnhancedLocation } from '../types';
import { locationDetails } from '../data/communities';

interface LocationDetailsProps {
  location: EnhancedLocation;
}

const LocationDetails = ({ location }: LocationDetailsProps) => {
  const details = locationDetails[location.id];
  
  if (details) {
    return (
      <div className="flex flex-col gap-0.5">
        <div className="text-gray-600 text-sm m-0 p-0">{details.price}</div>
        <div className="text-gray-600 text-sm m-0 p-0">{details.bedrooms}</div>
        <div className="text-gray-600 text-sm m-0 p-0">{details.sqft}</div>
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
