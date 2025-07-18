
import { useState } from 'react';
import Map, { Location } from '../components/Map';
import LocationGrid from '../components/LocationGrid';
import { locations } from '../data/communities';
import { Button } from '@shared-ui/button';

const MapPage = () => {
  const [visibleLocationIds, setVisibleLocationIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const handleVisibleLocationsChange = (ids: string[]) => {
    setVisibleLocationIds(ids);
  };

  const visibleLocations = locations.filter(location =>
    visibleLocationIds.includes(location.id)
  );

  const toggleView = () => {
    setViewMode(viewMode === 'map' ? 'list' : 'map');
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
        {/* Map View */}
        <div className={viewMode === 'map' ? '' : 'hidden'}>
          <div className="px-4 h-[55vh]">
            <Map
              locations={locations}
              zoom={14}
              onVisibleLocationsChange={handleVisibleLocationsChange}
            />
          </div>
          {/* Toggle button and headline below map */}
          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Featured Properties ({visibleLocations.length})
              </h2>
              <Button
                onClick={toggleView}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {viewMode === 'map' ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>List</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                    <span>Map</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="w-full h-[calc(66.66vh-3.5rem)] bg-white">
            <div className="overflow-y-auto h-full px-4 pb-4">
              <LocationGrid locations={visibleLocations} />
            </div>
          </div>
        </div>

        {/* List View */}
        <div className={viewMode === 'list' ? '' : 'hidden'}>
          <div className="h-screen w-full pt-16 overflow-hidden bg-white">
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
