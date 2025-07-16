
import { ScrollArea } from "./ui/scroll-area";
import LocationCard from './LocationCard';
import { EnhancedLocation } from '../types';

interface LocationGridProps {
  locations: EnhancedLocation[];
}

const LocationGrid = ({ locations }: LocationGridProps) => {
  return (
    <ScrollArea className="h-full w-full pr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {locations.map(location => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default LocationGrid;
