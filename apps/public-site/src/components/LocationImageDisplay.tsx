import { useEffect, useState, useMemo } from 'react';
import { EnhancedLocation } from '@shared-types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@shared-ui/carousel';

interface LocationImageDisplayProps {
  location: EnhancedLocation;
}

const getSlugFromName = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const LocationImageDisplay = ({ location }: LocationImageDisplayProps) => {
  const slug = useMemo(() => getSlugFromName(location.name), [location.name]);

  const [imageFolders, setImageFolders] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [allImages, setAllImages] = useState<string[]>([]);

  // Step 1: Fetch imageFolders from property-info.json
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch(`/data/properties/${slug}/property-info.json`);
        if (!res.ok) throw new Error('Metadata fetch failed');
        const json = await res.json();
        const folders = json?.metadata?.imageFolders || [];
        setImageFolders(folders);
      } catch (err) {
        console.error(`❌ Failed to load metadata for ${slug}`, err);
      }
    };

    fetchMetadata();
  }, [slug]);

  // Step 2: Build all potential image paths
  useEffect(() => {
    if (!imageFolders.length) return;

    const generated: string[] = [];
    imageFolders.forEach(folder => {
      for (let i = 1; i <= 20; i++) {
        generated.push(`/assets/${slug}/${folder}/${String(i).padStart(2, '0')}.jpg`);
      }
    });

    setAllImages(generated);
  }, [imageFolders, slug]);

  // Step 3: Filter existing images by attempting to load them
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!allImages.length) return;

    let loadedCount = 0;
    const found: string[] = [];

    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        found.push(src);
        loadedCount++;
        if (loadedCount === allImages.length) {
          setExistingImages(found);
          setChecked(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === allImages.length) {
          setExistingImages(found);
          setChecked(true);
        }
      };
    });
  }, [allImages]);

  if (!checked) {
    return (
      <div className="relative h-40 w-full bg-gray-100 animate-pulse" />
    );
  }

  if (existingImages.length > 1) {
    return (
      <div className="relative h-40 w-full">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {existingImages.map((src, index) => (
              <CarouselItem key={index}>
                <div className="relative h-40 w-full">
                  <img
                    src={src}
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
  } else if (existingImages.length === 1) {
    return (
      <div className="relative h-40 w-full">
        <img
          src={existingImages[0]}
          alt={location.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  } else {
    return (
      <div className="relative h-40 w-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
        No images available
      </div>
    );
  }
};

export default LocationImageDisplay;