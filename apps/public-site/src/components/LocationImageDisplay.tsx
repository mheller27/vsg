import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@shared-ui/carousel";
import { EnhancedLocation } from '@shared-types';
import { useEffect, useState } from "react";

interface LocationImageDisplayProps {
  location: EnhancedLocation;
}

const LocationImageDisplay = ({ location }: LocationImageDisplayProps) => {
  const [filteredThumbnails, setFilteredThumbnails] = useState<string[]>([]);

  const getSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const getFullImagePath = (slug: string, folder: string, index: number) =>
    `/assets/${slug}/${folder}/${String(index + 1).padStart(2, "0")}.jpg`;
  
  const getThumbnailPath = (fullPath: string) => {
    const pathParts = fullPath.split('/');
    const fileName = pathParts.pop();        // e.g. "01.jpg"
    const folderName = pathParts.pop();      // e.g. "residences"
    return [...pathParts, folderName, 'thumbnails', fileName].join('/');
  };

  useEffect(() => {
    const slug = getSlug(location.name);
  
    const fetchImageFolders = async () => {
      try {
        const res = await fetch(`/data/properties/${slug}/property-info.json`);
        if (!res.ok) throw new Error("Failed to load property-info.json");
        const data = await res.json();
        const imageFolders = data.metadata?.imageFolders || [];
  
        console.log("Slug:", slug);
        console.log("Image folders:", imageFolders);
  
        const maxImagesPerFolder = 20;
        const imagePaths: string[] = [];

        imageFolders.forEach((folder: string) => {
          for (let i = 0; i < maxImagesPerFolder; i++) {
            const fullImagePath = getFullImagePath(slug, folder, i);
            const thumbnailPath = getThumbnailPath(fullImagePath);
            imagePaths.push(thumbnailPath);
          }
        });
        const validImages: string[] = [];
  
        await Promise.all(
          imagePaths.map(
            (src) =>
              new Promise<void>((resolve) => {
                console.log("Attempting to load image:", src);
                const img = new Image();
                img.src = src;
                img.onload = () => {
                  validImages.push(src);
                  resolve();
                };
                img.onerror = resolve;
              })
          )
        );
  
        setFilteredThumbnails(validImages);
      } catch (error) {
        console.error("Error loading image folders or images", error);
      }
    };
  
    fetchImageFolders();
  }, [location]);

  if (filteredThumbnails.length > 1) {
    return (
      <div className="relative h-40 w-full">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {filteredThumbnails.map((imageUrl, index) => (
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
  } else if (filteredThumbnails.length === 1) {
    return (
      <div className="relative h-40 w-full">
        <img
          src={filteredThumbnails[0]}
          alt={location.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  }

  return null;
};

export default LocationImageDisplay;