import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@shared-ui/carousel";
import { EnhancedLocation } from '@shared-types';

interface LocationImageDisplayProps {
  location: EnhancedLocation;
}

const LocationImageDisplay = ({ location }: LocationImageDisplayProps) => {
  if (location.imageUrls && location.imageUrls.length > 0) {
    // Render carousel for locations with multiple images
    return (
      <div className="relative h-40 w-full">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {location.imageUrls.map((imageUrl, index) => (
              <CarouselItem key={index}>
                <div className="relative h-40 w-full">
                  <img
                    src={imageUrl}
                    alt={`${location.name} - Image ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    );
  } else if (location.imageUrl) {
    // Render single image for locations with only one image
    return (
      <div className="relative h-40 w-full">
        <img
          src={location.imageUrl}
          alt={location.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  }
  return null;
};

export default LocationImageDisplay;
