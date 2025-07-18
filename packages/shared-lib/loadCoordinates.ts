import propertySlugs from '@shared-lib/propertySlugs'; 

export interface Location {
  id: string;
  coordinates: [number, number];
  title: string;
}

export const loadCoordinates = async (): Promise<Location[]> => {
  const locations: Location[] = [];
  console.log('Starting loadCoordinates with slugs:', propertySlugs);

  for (const slug of propertySlugs) {
    try {
      console.log(`Loading data for ${slug}...`);
      // Use fetch to load the JSON file from the public directory
      const response = await fetch(`/data/properties/${slug}/property-info.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${slug}: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Data for ${slug}:`, data.metadata);
      
      const coordinates = data.metadata?.property_coordinates;
      const title = data.metadata?.property_name;

      console.log(`Coordinates for ${slug}:`, coordinates);
      console.log(`Title for ${slug}:`, title);

      if (Array.isArray(coordinates) && coordinates.length === 2) {
        const location = {
          id: slug,
          coordinates: coordinates as [number, number],
          title: title ?? slug, // fallback to slug if title is missing
        };
        locations.push(location);
        console.log(`Added location:`, location);
      } else {
        console.warn(`Invalid coordinates for ${slug}:`, coordinates);
      }
    } catch (err) {
      console.error(`Failed to load coordinates for ${slug}`, err);
    }
  }

  console.log('Final loaded locations:', locations);
  return locations;
};

