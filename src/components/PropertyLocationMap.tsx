import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface PropertyLocationMapProps {
  coordinates: [number, number]; // [longitude, latitude]
  zoom?: number;
}

const PropertyLocationMap = ({ coordinates, zoom = 15 }: PropertyLocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibWhlbGxlcjI3IiwiYSI6ImNtYXIxZG50MDA2NTkybXB2M2dsanYyNXkifQ.oNTMdAnZZizCCU8VeRoYfA';
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates,
      zoom: zoom,
      attributionControl: true
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates, zoom]);

  return (
    <div ref={mapContainer} className="w-full h-80 rounded-lg" />
  );
};

export default PropertyLocationMap;
