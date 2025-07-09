import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Phone, MessageSquare, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

interface UnitPageProps {
  unit: any;
  isOpen: boolean;
  onClose: () => void;
}

const UnitPage: React.FC<UnitPageProps> = ({ unit, isOpen, onClose }) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('floorplan');

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isMobile) {
        onClose();
      }
    };
  
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
  
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isMobile, onClose]);

  // Update active tab when unit changes or tabs availability changes
  useEffect(() => {
    if (unit) {
      const hasFloorplan = unit.floorplan_pdf && typeof unit.floorplan_pdf === 'string' && unit.floorplan_pdf.trim();
      const hasPhotos = unit.photos && Array.isArray(unit.photos) && unit.photos.length > 0;
      const hasVideo = typeof unit.video === 'string' && unit.video.trim().startsWith('http');

      // Set default tab to the first available tab
      if (hasFloorplan) {
        setActiveTab('floorplan');
      } else if (hasPhotos) {
        setActiveTab('photos');
      } else if (hasVideo) {
        setActiveTab('video');
      }
    }
  }, [unit]);

  if (!isOpen || !unit) return null;

  // Check what tabs should be shown
  const hasFloorplan = unit.floorplan_pdf && typeof unit.floorplan_pdf === 'string' && unit.floorplan_pdf.trim();
  const hasPhotos = unit.photos && Array.isArray(unit.photos) && unit.photos.length > 0;
  const hasVideo = typeof unit.video === 'string' && unit.video.trim().startsWith('http');

  // Get available tabs for grid calculation
  const availableTabs = [];
  if (hasFloorplan) availableTabs.push('floorplan');
  if (hasPhotos) availableTabs.push('photos');
  if (hasVideo) availableTabs.push('video');

  // Get price/availability display
  const getPriceDisplay = () => {
    if (unit.availability === "Sold") {
      return "Sold";
    } else if (unit.availability === "Available") {
      return "Contact us for price";
    } else if (unit.availability === "For Sale" && unit.price && unit.price !== 'null') {
      return unit.price;
    } else if (unit.price && unit.price !== 'null') {
      return unit.price;
    }
    return "Contact us for price";
  };

  // Get bedroom/bathroom display with den/bonus room
  const getBedroomBathroomDisplay = () => {
    const parts = [];
    if (unit.beds) parts.push(`${unit.beds} Bedrooms`);
    if (unit.baths) parts.push(`${unit.baths} Bathrooms`);
    if (unit.den) parts.push('Den');
    if (unit.bonus_room) parts.push('Bonus Room');
    return parts.join(' • ');
  };

  // Format square footage with commas
  const formatSqft = (value: string | number) => {
    if (!value) return '';
    const num = typeof value === 'string' ? value.replace(/[^\d]/g, '') : value;
    return new Intl.NumberFormat().format(Number(num));
  };

  // Info section content
  const InfoSection = () => (
    <div className="bg-white border-b border-gray-200 p-4 md:p-6">
      <div className="space-y-3 md:space-y-4">
        {/* First Row: Residence name, unit number, and price/availability */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
              {unit.residence || 'Unit Information'}
            </h1>
            {unit.unit && (
              <span className="text-base md:text-lg text-gray-600">
                Unit {unit.unit}
              </span>
            )}
          </div>
          <div className={`text-lg md:text-xl lg:text-2xl font-bold ${
            unit.availability === "Sold"
              ? 'text-red-600'
              : unit.availability === "Available" || getPriceDisplay() === "Contact us for price"
              ? 'text-blue-700'
              : 'text-green-700'
          }`}>
            {getPriceDisplay()}
          </div>
        </div>

        {/* Second Row: Bedrooms, bathrooms, den, bonus room */}
        {getBedroomBathroomDisplay() && (
          <div className="text-sm md:text-base text-gray-600">
            {getBedroomBathroomDisplay()}
          </div>
        )}

        {/* Third Row: Interior SF, Exterior SF, Total SF */}
        <div className="flex flex-wrap gap-4 text-sm md:text-base text-gray-600">
          {unit.interior_sqft && (
            <span>Interior: {formatSqft(unit.interior_sqft)} SF</span>
          )}
          {unit.exterior_sqft && (
            <span>Exterior: {formatSqft(unit.exterior_sqft)} SF</span>
          )}
          {unit.total_sqft && (
            <span>Total: {formatSqft(unit.total_sqft)} SF</span>
          )}
        </div>

        {/* Fourth Row: Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            size={isMobile ? "sm" : "default"}
            className="bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 min-h-[44px] px-4"
          >
            <Phone className="h-4 w-4" />
            <span className="text-sm md:text-base">Call</span>
          </Button>
          <Button 
            size={isMobile ? "sm" : "default"}
            className="bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 min-h-[44px] px-4"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm md:text-base">Text</span>
          </Button>
          <Button 
            size={isMobile ? "sm" : "default"}
            className="bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 min-h-[44px] px-4"
          >
            <Video className="h-4 w-4" />
            <span className="text-sm md:text-base">Tour</span>
          </Button>
        </div>
      </div>
    </div>
  );

  // Tabbed content section
  const TabsSection = () => (
    <div className="p-4 md:p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className={`grid w-full mb-6 ${
            availableTabs.length === 1
              ? 'grid-cols-1'
              : availableTabs.length === 2
              ? 'grid-cols-2'
              : 'grid-cols-3'
          }`}
        >
          {hasFloorplan && <TabsTrigger value="floorplan">Floorplan</TabsTrigger>}
          {hasPhotos && <TabsTrigger value="photos">Photos</TabsTrigger>}
          {hasVideo && <TabsTrigger value="video">Video</TabsTrigger>}
        </TabsList>

        {hasFloorplan && (
          <TabsContent value="floorplan" className="m-0">
            <div className="bg-gray-50 rounded-lg border border-gray-200">
              {unit.floorplan_pdf ? (
                <iframe
                  src={`${unit.floorplan_pdf}#toolbar=1&navpanes=0`}
                  title={`Floorplan for ${unit.residence} Unit ${unit.unit}`}
                  className="w-full min-h-[90vh] border-0"
                  onLoad={() => console.log(`PDF loaded successfully for ${unit.residence} Unit ${unit.unit}`)}
                  onError={(e) => console.error(`PDF failed to load for ${unit.residence} Unit ${unit.unit}:`, e)}
                />
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-lg font-medium mb-2">Floorplan PDF not available</div>
                    <div className="text-sm">No floorplan document found for this unit</div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {hasPhotos && (
          <TabsContent value="photos" className="m-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Unit Photos</h3>
              {unit.photos && unit.photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unit.photos.map((imagePath: string, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={imagePath}
                        alt={`${unit.residence} Unit ${unit.unit} - Photo ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg border border-gray-200 h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-lg font-medium mb-2">No photos available for this unit</div>
                    <div className="text-sm">Unit photos will be displayed here when available</div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {hasVideo && (
  <TabsContent value="video" className="m-0">
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
      {(() => {
        const youtubeId = extractYouTubeID(unit.video);
        return youtubeId ? (
          <div className="relative mx-auto" style={{ width: '80%', paddingBottom: '45%', height: 0 }}>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={`Video Tour for ${unit.residence} Unit ${unit.unit}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            />
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">Video not available</div>
              <div className="text-sm">The provided video URL is invalid or missing a YouTube ID.</div>
            </div>
          </div>
        );
      })()}
    </div>
  </TabsContent>
)}
        {/* Optional fallback if no tabs are available */}
        {availableTabs.length === 0 && (
          <div className="bg-gray-50 rounded-lg border border-gray-200 h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">No Content Available</div>
              <div className="text-sm">No floorplan, photos, or video available for this unit</div>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );

  const extractYouTubeID = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.slice(1); // gets ID after youtu.be/
    }
    if (parsedUrl.hostname.includes('youtube.com')) {
      return parsedUrl.searchParams.get('v'); // gets ?v=xxx
    }
    return null;
  } catch (e) {
    return null;
  }
};
  
  // Mobile full-page layout
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        {/* Mobile Header - Sticky */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center sticky top-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Unit Details</h1>
        </div>

        {/* Scrollable Content */}
        <InfoSection />
        <TabsSection />
      </div>
    );
  }

  // Desktop modal layout
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal Content - Scrollable */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] mx-4 overflow-y-auto">
        {/* Desktop Header - Sticky */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-semibold">Unit Details</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <InfoSection />
        <TabsSection />
      </div>
    </div>
  );
};

export default UnitPage;