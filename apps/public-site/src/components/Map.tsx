import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import debounce from 'lodash.debounce';
import { EnhancedLocation } from '@shared-types';
import { Bed, Ruler } from 'lucide-react';

interface MapProps {
  locations: EnhancedLocation[];
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  onVisibleLocationsChange?: (visibleLocationIds: string[]) => void;
}

// Helper function to get Lucide React icon SVG paths
const getLucideIconPath = (iconName: 'bed' | 'ruler') => {
  if (iconName === 'bed') {
    // Lucide React Bed icon paths
    return 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9';
  } else if (iconName === 'ruler') {
    // Lucide React Ruler icon paths
    return 'M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z M14.5 12.5 2-2 M11.5 9.5 2-2 M8.5 6.5 2-2 M17.5 15.5 2-2';
  }
  return '';
};

const getPopupData = async (slug: string) => {
  try {
    const response = await fetch(`/data/properties/${slug}/property-info.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${slug}: ${response.status}`);
    }
    
    const data = await response.json();
    const metadata = data.metadata || {};
    const units = data.units || [];

    // Get price range from units
    const getPriceRange = (units: any[]) => {
      const validPrices = units
        .map(unit => unit.price)
        .filter(price => price && price !== 'Contact us' && price !== 'null' && price !== 'Sold')
        .map(price => parseFloat(price!.replace(/[$,]/g, '')))
        .filter(price => !isNaN(price)) as number[];

      if (validPrices.length === 0) return 'Contact us for pricing';

      const min = Math.min(...validPrices);
      const max = Math.max(...validPrices);
      const formatPrice = (price: number) => `$${price.toLocaleString()}`;
      return `${formatPrice(min)} - ${formatPrice(max)}`;
    };

    // Get bedroom range from units
    const getBedroomRange = (units: any[]) => {
      const beds = units.map(unit => unit.beds).filter(Boolean) as number[];
      if (beds.length === 0) return 'N/A';
      const min = Math.min(...beds);
      const max = Math.max(...beds);
      return min === max ? `${min} Beds` : `${min} - ${max} Beds`;
    };

    // Get sqft range from units
    const getSqftRange = (units: any[]) => {
      const sqfts = units.map(unit => unit.interior_sqft).filter(Boolean) as number[];
      if (sqfts.length === 0) return 'N/A';
      const min = Math.min(...sqfts);
      const max = Math.max(...sqfts);
      const formatSqft = (sqft: number) => sqft.toLocaleString();
      return min === max ? formatSqft(min) : `${formatSqft(min)} - ${formatSqft(max)}`;
    };

    return {
      mainImage: metadata.profile_image || null,
      price: getPriceRange(units),
      bedrooms: getBedroomRange(units),
      sqft: getSqftRange(units)
    };
  } catch (error) {
    console.warn(`Failed to load popup data for ${slug}:`, error);
    return {
      mainImage: null,
      price: 'Contact us for pricing',
      bedrooms: 'N/A',
      sqft: 'N/A'
    };
  }
};

const Map = ({ locations, center = [-82.548444, 27.340194], zoom = 13, onVisibleLocationsChange }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const initialVisibleLocationsSet = useRef(false);

  const getPropertySlug = (locationId: string) => {
    return locationId.toLowerCase(); // You could keep the slug cleanup if needed
  };
  

  // Wrap the callback in a debounce (e.g., 200ms)
  const debouncedOnVisibleLocationsChange = useRef(
    debounce((ids: string[]) => {
      onVisibleLocationsChange?.(ids);
    }, 200)
  ).current;

  const checkVisibleLocations = () => {
    if (!map.current || !onVisibleLocationsChange) return;
    const bounds = map.current.getBounds();
    const mapCanvas = map.current.getContainer();
    const mapWidth = mapCanvas.offsetWidth;
    const mapHeight = mapCanvas.offsetHeight;

    if (mapWidth === 0 || mapHeight === 0) {
      console.warn('[checkVisibleLocations] Map size is zero, skipping visible locations update.');
      return;
    }

    const visibleLocationIds = locations
      .filter(location => {
        const pixel = map.current!.project(location.coordinates);
        return pixel.x >= 0 && pixel.x <= mapWidth && pixel.y >= 0 && pixel.y <= mapHeight;
      })
      .map(location => location.id);

    // Detailed logging for debugging
    console.log('[checkVisibleLocations] bounds:', bounds.toArray());
    console.log(`[checkVisibleLocations] map size: ${mapWidth}x${mapHeight}`);
    locations.forEach(location => {
      const pixel = map.current!.project(location.coordinates);
      const inViewport = pixel.x >= 0 && pixel.x <= mapWidth && pixel.y >= 0 && pixel.y <= mapHeight;
      console.log(`Location ${location.title} (${location.coordinates}) | pixel: (${pixel.x.toFixed(1)}, ${pixel.y.toFixed(1)}) | inViewport: ${inViewport}`);
    });
    console.log('[checkVisibleLocations] visible count:', visibleLocationIds.length, 'of', locations.length, 'ids:', visibleLocationIds);
    onVisibleLocationsChange(visibleLocationIds);
  };

  useEffect(() => {
    // Initialize map only once
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibWhlbGxlcjI3IiwiYSI6ImNtYXIxZG50MDA2NTkybXB2M2dsanYyNXkifQ.oNTMdAnZZizCCU8VeRoYfA';
    console.log("Initializing Mapbox map...");
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom,
      attributionControl: true
    });

    // Add navigation controls (zoom in/out buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add event listeners for map movement
    map.current.on('moveend', checkVisibleLocations);
    map.current.on('zoomend', checkVisibleLocations);
    map.current.on('resize', checkVisibleLocations);

    // Initial check when map loads - ensure this happens after the map is fully loaded
    map.current.on('load', () => {
      console.log('Map loaded, forcing resize and checking initial visible locations');
      setTimeout(() => {
        map.current && map.current.resize();
        // Only check visible locations if we have locations data
        if (locations.length > 0) {
          checkVisibleLocations();
        }
      }, 700);
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [locations]); // Add locations as dependency

  // Add or update markers when locations change
  useEffect(() => {
    if (!map.current) return;

    console.log(`Adding ${locations.length} markers to map`);

    // Clear any existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers for each location
    const addMarkers = async () => {
      for (const location of locations) {
        const propertySlug = getPropertySlug(location.id);
        const { mainImage, price, bedrooms, sqft } = await getPopupData(propertySlug);
    
        // Create enhanced popup HTML with responsive mobile design
        const popupHTML = `
          <div style="
            display: flex;
            max-width: 90vw;
            width: 100%;
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.4;
            box-sizing: border-box;
            flex-direction: row;
          ">
            <div style="
              flex: 0 0 100px;
              width: 100px;
              height: auto;
              margin-right: 12px;
              box-sizing: border-box;
              display: flex;
              align-items: stretch;
            ">
              <img 
                src="${mainImage}" 
                alt="${location.title}"
                style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  border-radius: 6px;
                  box-sizing: border-box;
                  display: block;
                "
              />
            </div>
            <div style="
              flex: 1 1 0%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              min-width: 0;
              box-sizing: border-box;
            ">
              <div style="box-sizing: border-box;">
                <h3 style="
                  font-weight: 600;
                  font-size: 14px;
                  margin: 0 0 6px 0;
                  color: #1f2937;
                  box-sizing: border-box;
                ">${location.title}</h3>
                <div style="margin-bottom: 6px; box-sizing: border-box;">
                  ${price ? `<div style="color: #6b7280; font-size: 12px; margin-bottom: 3px;">${price}</div>` : ''}
                  ${bedrooms ? `<div style="color: #6b7280; font-size: 12px; margin-bottom: 3px; display: flex; align-items: center; gap: 4px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
                      <path d="M2 4v16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2 8h18a2 2 0 0 1 2 2v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2 17h20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M6 8v9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    ${bedrooms}
                  </div>` : ''}
                  ${sqft ? `<div style="color: #6b7280; font-size: 12px; display: flex; align-items: center; gap: 4px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
                      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="m14.5 12.5 2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="m11.5 9.5 2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="m8.5 6.5 2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="m17.5 15.5 2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    ${sqft}
                  </div>` : ''}
                </div>
              </div>
              <div style="margin-top: auto; box-sizing: border-box;">
                <a href="/property/${propertySlug}" class="view-details-button" style="
                  display: block;
                  width: 100%;
                  background-color: #3b82f6;
                  color: white;
                  text-decoration: none;
                  padding: 6px 8px;
                  border-radius: 4px;
                  font-size: 11px;
                  font-weight: 500;
                  text-align: center;
                  transition: background-color 0.2s;
                  box-sizing: border-box;
                " 
                onmouseover="this.style.backgroundColor='#2563eb'"
                onmouseout="this.style.backgroundColor='#3b82f6'">
                  View Details
                </a>
              </div>
            </div>
          </div>
        `;
    
        const popup = new mapboxgl.Popup({
          offset: 25,
          maxWidth: '320px',
          className: 'custom-popup',
          closeOnClick: true,
          closeButton: false,
        }).setHTML(popupHTML);
    
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#FF0000"/>
          </svg>
        `;
    
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat(location.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
    
        markers.current.push(marker);
      }

      // Force resize and check visible locations after markers are added
      if (map.current.loaded()) {
        setTimeout(() => {
          map.current && map.current.resize();
          checkVisibleLocations();
        }, 200);
      }
    };

    addMarkers();
  }, [locations]);

  // Check visible locations when locations change
  useEffect(() => {
    if (map.current && map.current.loaded() && locations.length > 0) {
      console.log('Locations changed, checking visible locations...');
      setTimeout(() => {
        checkVisibleLocations();
      }, 100);
    }
  }, [locations]);

  return (
    <>
      <style>{`
        .custom-marker {
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .custom-marker:hover {
          transform: scale(1.1);
        }
        .custom-popup .mapboxgl-popup-content {
          padding: 10px !important;
          border-radius: 8px !important;
          max-width: 90vw !important;
          box-sizing: border-box !important;
        }
        .custom-popup .mapboxgl-popup-tip {
          border-top-color: white !important;
        }
        .custom-popup .mapboxgl-popup-close-button {
          display: none !important;
        }
        @media (max-width: 480px) {
          .custom-popup .mapboxgl-popup-content {
            max-width: 95vw !important;
            padding: 8px !important;
          }
        }
      `}</style>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </>
  );
};

export default Map;
