import LocationDetails from "./LocationDetails";
import LocationImageDisplay from "./LocationImageDisplay";
import { EnhancedLocation } from '@shared-types';
import { Link } from "react-router-dom";

interface LocationCardProps {
  location: EnhancedLocation;
}

const LocationCard = ({ location }: LocationCardProps) => {
  const getPropertySlug = (locationName: string) => {
    return locationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <div className="overflow-hidden hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-neutral-900/50 transition-all duration-200 relative group bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
      <LocationImageDisplay location={location} />
      <div className="p-4 relative">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white transition-colors duration-200">{location.title}</h3>
        <LocationDetails location={location} />
        
        {/* View Details button positioned in bottom-right corner */}
        <Link 
          to={`/property/${location.id}`}
          className="absolute bottom-4 right-4 block bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-medium px-2 py-1.5 rounded transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default LocationCard;
