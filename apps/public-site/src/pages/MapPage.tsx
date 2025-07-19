
import { useEffect, useState } from 'react';
import Map from '../components/Map';
import LocationGrid from '../components/LocationGrid';
import { Button } from '@shared-ui/button';
import { loadCoordinates } from '@shared-lib/loadCoordinates';
import { EnhancedLocation } from '@shared-types';
import MapBottomSheet from '../components/MapBottomSheet';

const MapPage = () => {
  const [locations, setLocations] = useState<EnhancedLocation[]>([]);
  const [visibleLocationIds, setVisibleLocationIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    console.log('MapPage: Starting to load coordinates...');
    loadCoordinates()
      .then((loadedLocations) => {
        console.log('MapPage: Received locations:', loadedLocations);
        setLocations(loadedLocations);
      })
      .catch((error) => {
        console.error('MapPage: Error loading coordinates:', error);
      });
  }, [isClient]);
  

  const handleVisibleLocationsChange = (ids: string[]) => {
    console.log('MapPage: Visible locations changed:', ids);
    setVisibleLocationIds(ids);
  };

  const visibleLocations = locations.filter(location =>
    visibleLocationIds.includes(location.id)
  );

  console.log('MapPage: Current state - locations:', locations.length, 'visible:', visibleLocations.length);

  const toggleView = () => {
    setViewMode(viewMode === 'map' ? 'list' : 'map');
  };

  // Bottom sheet configuration
  const [viewportHeight, setViewportHeight] = useState(0);
  
  useEffect(() => {
    if (!isClient) return;
    
    setViewportHeight(window.innerHeight);
    
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);
  
  const mapHeight = Math.floor(viewportHeight * 0.55); // 55vh
  const bottomSheetMaxHeight = viewportHeight - 48; // Full height minus tab bar
  
  const snapPoints = {
    closed: bottomSheetMaxHeight - 120, // Flush with map bottom + gap
    partial: Math.floor(viewportHeight * 0.5), // 50% of viewport
    full: 48, // Just below tab bar
  };

  return (
    <div className="relative">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="container mx-auto px-1 py-8">
          <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full">
              <div className="h-full w-full rounded-lg overflow-hidden">
                <Map
                  locations={locations}
                  zoom={14}
                  onVisibleLocationsChange={handleVisibleLocationsChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col">
              <h2 className="text-lg font-semibold mb-4">
                Featured Locations ({visibleLocations.length} visible)
              </h2>
              <div className="flex-1 overflow-hidden">
                <LocationGrid locations={visibleLocations} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Compact Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'map'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Map</span>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>List</span>
              </div>
            </button>
          </div>
        </div>

        {/* Map View */}
        <div className={viewMode === 'map' ? '' : 'hidden'}>
          <div className="px-4 h-[55vh]">
            <Map
              locations={locations}
              zoom={14}
              onVisibleLocationsChange={handleVisibleLocationsChange}
            />
          </div>
          
          {/* Bottom Sheet */}
          {isClient && viewportHeight > 0 && (
            <MapBottomSheet
              isOpen={viewMode === 'map'}
              onClose={() => setViewMode('list')}
              snapPoints={snapPoints}
              maxHeight={bottomSheetMaxHeight}
            >
              <div className="px-4 py-3">
                <h2 className="text-lg font-semibold mb-4">
                  Featured Properties ({visibleLocations.length})
                </h2>
                <LocationGrid locations={visibleLocations} />
              </div>
            </MapBottomSheet>
          )}
        </div>

        {/* List View */}
        <div className={viewMode === 'list' ? '' : 'hidden'}>
          <div className="h-[calc(100vh-3rem)] w-full overflow-hidden bg-white">
            <div className="h-full px-4 py-4 overflow-y-auto">
              <LocationGrid locations={visibleLocations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
