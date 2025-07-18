import { Card, CardContent } from "@shared-ui/card";
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
    <Card className="overflow-hidden hover:shadow-md transition-shadow relative">
      <LocationImageDisplay location={location} />
      <CardContent className="p-4 relative">
        <h3 className="font-semibold text-lg">{location.title}</h3>
        <LocationDetails location={location} />
        
        {/* View Details button positioned in bottom-right corner */}
        <Link 
          to={`/property/${location.id}`}
          className="absolute bottom-4 right-4 block bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-2 py-1.5 rounded transition-colors"
        >
          View Details
        </Link>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
