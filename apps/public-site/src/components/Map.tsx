import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { locationDetails } from '../data/communities';
import debounce from 'lodash.debounce';
import { EnhancedLocation } from '@shared-types';

interface MapProps {
  locations: EnhancedLocation[];
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  onVisibleLocationsChange?: (visibleLocationIds: string[]) => void;
}

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
    locations.forEach(location => {
      const details = locationDetails[location.id];
      const mainImage = location.imageUrls?.[0] || location.imageUrl;
      const propertySlug = getPropertySlug(location.id); // slug should come from id

      
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
              ${details ? `
                <div style="margin-bottom: 6px; box-sizing: border-box;">
                  <div style="color: #6b7280; font-size: 12px; margin-bottom: 1px; box-sizing: border-box;">${details.price}</div>
                  <div style="color: #6b7280; font-size: 12px; margin-bottom: 1px; box-sizing: border-box;">${details.bedrooms}</div>
                  <div style="color: #6b7280; font-size: 12px; box-sizing: border-box;">${details.sqft}</div>
                </div>
              ` : `
                <p style="
                  color: #6b7280;
                  font-size: 12px;
                  margin: 0 0 6px 0;
                  box-sizing: border-box;
                ">${location.description}</p>
              `}
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
        // anchor: 'auto' // you can omit this, 'auto' is default
      }).setHTML(popupHTML);

      // Create custom marker element
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
    });

    // Force resize and check visible locations after markers are added
    if (map.current.loaded()) {
      setTimeout(() => {
        map.current && map.current.resize();
        checkVisibleLocations();
      }, 200);
    }
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
