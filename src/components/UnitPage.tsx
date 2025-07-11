import '@/pdfWorker';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, ArrowLeft, Phone, MessageSquare, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import LazyLoad from 'react-lazyload';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface UnitPageProps {
  unit: any;
  isOpen: boolean;
  onClose: () => void;
}


const FloorplanViewer = ({ file }: { file: string }) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isMobile && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const defaultPdfWidth = 612;
      const newScale = (containerWidth / defaultPdfWidth) * 0.6;
      setScale(newScale);
    }
  }, [file, isMobile]);

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };

  const handleLoadError = (error: Error) => {
    setError(error.message);
  };

  if (isMobile) {
    return (
      <div ref={containerRef} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-800">Zoom</span>
          <div className="flex gap-2 items-center">
            <button
              className="border border-gray-300 rounded px-3 py-1 text-sm"
              onClick={() => setScale((s) => Math.max(0.2, s - 0.2))}
            >
              -
            </button>
            <button
              className="border border-gray-300 rounded px-3 py-1 text-sm"
              onClick={() => setScale((s) => Math.min(3.0, s + 0.2))}
            >
              +
            </button>
            <a
              href={file}
              download
              className="ml-2 border border-blue-600 bg-white text-blue-600 rounded px-3 py-1 text-sm hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 transition"
              style={{ textDecoration: 'none' }}
            >
              Download
            </a>
          </div>
        </div>

        {error ? (
          <div className="text-red-500 p-4 text-center">Error loading PDF: {error}</div>
        ) : (
          <Document
            file={file}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
            loading={<div className="text-center p-4">Loading PDF...</div>}
          >
            {Array.from({ length: numPages || 0 }, (_, i) => (
              <Page
                key={`page_${i + 1}`}
                pageNumber={i + 1}
                scale={scale}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            ))}
          </Document>
        )}
      </div>
    );
  }

  // 🖥️ Desktop: use iframe
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      <iframe
        src={`${file}#toolbar=1&navpanes=0`}
        title="Floorplan PDF"
        className="w-full min-h-[90vh] border-0 rounded-lg"
        onLoad={() => console.log(`PDF loaded successfully: ${file}`)}
        onError={(e) => console.error(`PDF failed to load:`, e)}
      />
    </div>
  );
};



const UnitPage: React.FC<UnitPageProps> = ({ unit, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('floorplan');
  const isMobile = useIsMobile();
  
  // Lightbox state for photos
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  
  const [swiperModalOpen, setSwiperModalOpen] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(0);
  

  
  // Helper function to get thumbnail path
  const getThumbnailPath = (fullPath: string) => {
    // Convert full path to thumbnail path
    const pathParts = fullPath.split('/');
    const fileName = pathParts.pop(); // Get the filename
    const folderName = pathParts.pop(); // Get the folder name
    
    // Handle both patterns:
    // 1. Unit-specific: /assets/slug/units/unit-id/gallery/01.jpg -> /assets/slug/units/unit-id/gallery/thumbnails/01.jpg
    // 2. Shared residences: /assets/slug/residences/01.jpg -> /assets/slug/residences/thumbnails/01.jpg
    return [...pathParts, folderName, 'thumbnails', fileName].join('/');
  };
  
  // Helper function to detect if photos are unit-specific (in units folder)
  const hasUnitSpecificPhotos = useMemo(() => {
    if (!unit || !unit.photos || !Array.isArray(unit.photos)) return false;
    return unit.photos.some(photo => photo.includes('/units/'));
  }, [unit]);



  // Use unit photos directly - simpler approach
  const unitPhotos = useMemo(() => {
    if (!unit || !unit.photos || !Array.isArray(unit.photos)) return [];
    return unit.photos;
  }, [unit]);

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
  }, [isOpen, onClose]);

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

  // For debugging - let's see what's happening
  useEffect(() => {
    if (unit && unit.unit_id) {
      const slug = unit.unit_id.split('__')[0];
      console.log('🔍 Unit slug:', slug);
      console.log('🔍 Unit photos:', unit.photos);
      console.log('🔍 Has unit-specific photos:', hasUnitSpecificPhotos);
    }
  }, [unit, hasUnitSpecificPhotos]);

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
    if (unit.availability === "Sold") return "Sold";
    if (typeof unit.price === "string" && /^\$\d/.test(unit.price)) return unit.price; // numerical price
    if (typeof unit.price === "string" && unit.price.trim() !== "") return unit.price; // any other string
    return "Contact us for price"; // fallback
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

  const InfoSectionMobile = () => (
    <div className="bg-white border-b border-gray-200 p-4 space-y-3">
      {/* First 3 rows in column */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-gray-900">{unit.residence}</h1>
          {unit.unit && <div className="text-gray-600">Unit {unit.unit}</div>}
        </div>
        <div className={`font-bold ${
          unit.availability === "Sold"
            ? "text-red-600"
            : typeof unit.price === "string" && /^\$\d/.test(unit.price)
            ? "text-green-700"
            : "text-blue-700"
        }`}>
          {getPriceDisplay()}
        </div>
        {getBedroomBathroomDisplay() && (
          <div className="text-sm text-gray-600">{getBedroomBathroomDisplay()}</div>
        )}
        <div className="text-sm text-gray-600 flex flex-wrap gap-4">
          {unit.interior_sqft && <span>Interior: {formatSqft(unit.interior_sqft)} SF</span>}
          {typeof unit.exterior_sqft === 'number' && unit.exterior_sqft > 0 && (
            <span>Exterior: {formatSqft(unit.exterior_sqft)} SF</span>
          )}
        </div>
      </div>
  
      {/* Row 4: Buttons span full width */}
      <div className="flex justify-between gap-2">
        <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 h-8">
          <MessageSquare className="h-4 w-4 mr-1" />
          Contact
        </Button>
        <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 h-8">
          <Video className="h-4 w-4 mr-1" />
          Tour
        </Button>
      </div>
    </div>
  );
  
  const InfoSectionDesktop = () => (
    <div className="bg-white border-b border-gray-200 p-6 space-y-2">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{unit.residence}</h1>
        {unit.unit && <div className="text-lg text-gray-600">Unit {unit.unit}</div>}
      </div>
      <div className={`text-2xl font-bold ${
        unit.availability === "Sold"
          ? "text-red-600"
          : typeof unit.price === "string" && /^\$\d/.test(unit.price)
          ? "text-green-700"
          : "text-blue-700"
      }`}>
        {getPriceDisplay()}
      </div>
  
      {getBedroomBathroomDisplay() && (
        <div className="text-base text-gray-600">{getBedroomBathroomDisplay()}</div>
      )}
  
      <div className="flex flex-wrap gap-4 text-base text-gray-600">
        {unit.interior_sqft && <span>Interior: {formatSqft(unit.interior_sqft)} SF</span>}
        {typeof unit.exterior_sqft === 'number' && unit.exterior_sqft > 0 && (
          <span>Exterior: {formatSqft(unit.exterior_sqft)} SF</span>
        )}
        {unit.total_sqft && <span>Total: {formatSqft(unit.total_sqft)} SF</span>}
      </div>
  
      <div className="flex gap-3 pt-2">
        <Button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 px-8">
          <MessageSquare className="h-4 w-4" />
          Contact
        </Button>
        <Button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 px-8">
          <Video className="h-4 w-4" />
          Tour
        </Button>
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
                <div className="overflow-auto">
                  <FloorplanViewer file={unit.floorplan_pdf} />
                </div>
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
            <div>
              {/* Unit-specific photos with header */}
              <PhotoSection 
                title="Unit Renderings & Photos" 
                photos={unitPhotos} 
                startIndex={0} 
              />
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

  // Component to render a photo section
  const PhotoSection = ({ title, photos, startIndex }: { 
    title: string; 
    photos: string[]; 
    startIndex: number;
  }) => {
    if (!photos || photos.length === 0) return null;
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 overflow-y-auto max-h-[80vh]">
          {photos.map((src, idx) => {
            const thumbnailPath = getThumbnailPath(src);
            const globalIndex = startIndex + idx;
            return (
              <img
                key={`photo-section-${globalIndex}`}
                src={thumbnailPath}
                alt={`${title} - Photo ${idx + 1}`}
                loading="lazy"
                className="rounded-lg shadow-sm object-cover w-full cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  setSwiperIndex(globalIndex);
                  setSwiperModalOpen(true);
                }}
              />
            );
          })}
        </div>
        {/* Swiper Modal */}
        {swiperModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            tabIndex={-1}
            onClick={() => setSwiperModalOpen(false)}
            onKeyDown={e => { if (e.key === 'Escape') setSwiperModalOpen(false); }}
          >
            <div
              className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-lg flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                onClick={() => setSwiperModalOpen(false)}
                aria-label="Close gallery"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Swiper
                initialSlide={swiperIndex}
                navigation
                pagination={{ clickable: true }}
                keyboard={{ enabled: true }}
                spaceBetween={30}
                className="w-full h-full"
                modules={[Navigation, Pagination, Keyboard, EffectFade]}
                effect="slide"
                speed={300}
                loop={true}
              >
                {unitPhotos.map((src, idx) => (
                  <SwiperSlide key={`modal-slide-${idx}`}>
                    <div className="w-full h-full flex items-center justify-center bg-white">
                      <img
                        src={src}
                        alt={`${title} - Photo ${idx + 1}`}
                        className="object-contain w-full h-full max-h-[70vh] mx-auto rounded-lg"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        {/* Modal Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        {/* Modal Content - Mobile Friendly */}
        <div className="relative bg-white rounded-lg shadow-xl w-full h-full overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center sticky top-0 z-10">
            <Button variant="ghost" size="icon" onClick={onClose} className="mr-3">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Unit Details</h1>
          </div>
  
          {/* Scrollable Content */}
          <InfoSectionMobile />
          <TabsSection />
        </div>
  
        {/* Lightbox for mobile */}
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={unitPhotos.map(src => ({ src }))}
          index={photoIndex}
          on={{ view: ({ index }) => setPhotoIndex(index) }}
          animation={{
            fade: 400,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
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
        <InfoSectionDesktop />
        <TabsSection />
      </div>
      
      {/* Lightbox for unit photos */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={unitPhotos.map(src => ({ src }))}
        index={photoIndex}
        on={{ view: ({ index }) => setPhotoIndex(index) }}
        animation={{
          swipe: 500,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
};

export default UnitPage;