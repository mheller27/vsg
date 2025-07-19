import { useParams, Link } from 'react-router-dom';
import { Button } from '@shared-ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared-ui/tabs';
import { ArrowLeft, Plus, Minus, RotateCcw, Phone, Video, Heart, Bell } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared-ui/select';
import { useState, useEffect, useMemo, useRef } from 'react';
import UnitPage from '../components/UnitPage';
import { getSafeImageSrc } from '@shared-lib/fallbackImage'; // or the correct relative path
import PropertyHeader from '../components/PropertyProfileHeader';
import UnitHoverCard from '../components/UnitHoverCard';
import FloorplateUnitList from '../components/FloorplateUnitList';
import AllUnitsTab from '../components/AllUnitsTab';
import FloorplateViewer from '../components/FloorplateViewer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import LazyLoad from 'react-lazyload';
import PropertyDetailsTab from '@/components/PropertyDetailsTab';

// Add Unit type based on usage in this file
// This is a minimal type, expand as needed
interface Unit {
  unit_id: string;
  price?: string;
  beds?: number;
  interior_sqft?: number;
  availability?: string;
}

const normalizeId = (id: string) => id.trim().toLowerCase().replace(/\s+/g, '');
const styles = `
  .unit-grey {
    fill: transparent;
    stroke: #9CA3AF;
    stroke-miterlimit: 10;
    opacity: 0.7;
    transition: opacity 0.2s ease-in-out;
  }
  .unit-blue {
    fill: #93C5FD;
    stroke: #3B82F6;
    stroke-miterlimit: 10;
    opacity: 0.7;
    transition: opacity 0.2s ease-in-out;
  }
  .unit-green {
    fill: #6EE7B7;
    stroke: #6EE7B7;
    stroke-miterlimit: 10;
    opacity: 0.7;
    transition: opacity 0.2s ease-in-out;
  }
  .unit-grey:hover,
  .unit-blue:hover,
  .unit-green:hover {
    opacity: 0.9;
    cursor: pointer;
  }
  
  /* Dark mode adjustments for better contrast */
  .dark .unit-grey {
    stroke: #6B7280;
  }
  .dark .unit-blue {
    fill: #60A5FA;
    stroke: #2563EB;
  }
  .dark .unit-green {
    fill: #34D399;
    stroke: #34D399;
  }
`;

const PropertyProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedFloor, setSelectedFloor] = useState('');
  const [unitData, setUnitData] = useState<Unit[]>([]);
  const [propertyMetadata, setPropertyMetadata] = useState<any>(null);
  const [hoveredUnit, setHoveredUnit] = useState<any>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [displayX, setDisplayX] = useState(0);
  const [displayY, setDisplayY] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [isUnitPageOpen, setIsUnitPageOpen] = useState(false);
  const hoverCardRef = useRef<HTMLDivElement>(null);
  const [propertyFloorplates, setPropertyFloorplates] = useState<any>(null);
  const [propertyData, setPropertyData] = useState<any>(null);
  const floorOptions = propertyData?.floorOptions || [];
  const imageFolders = propertyMetadata?.imageFolders || [];
  
  useEffect(() => {
    if (propertyData?.floorOptions?.length && !selectedFloor) {
      setSelectedFloor(propertyData.floorOptions[0].value);
    }
  }, [propertyData, selectedFloor]);

  // Ensure users land at the top of the page when navigating to property profile
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [selectedPriceStatus, setSelectedPriceStatus] = useState<'listed' | 'unreleased' | null>(null);
  const availableBedroomCounts = useMemo(() => {
  const counts = new Set<number>();
  unitData.forEach((unit: Unit) => {
    if ((unit.availability === "Available" || unit.availability === "TBD") && typeof unit.beds === "number") {
      counts.add(unit.beds);
    }
  });
  return Array.from(counts).sort((a, b) => a - b);
}, [unitData]);

  useEffect(() => {
    const availableUnits = unitData.filter((unit: Unit) => 
      unit.availability === "Available" || unit.availability === "TBD"
    );

    const bedroomFiltered = selectedBedrooms !== null
      ? availableUnits.filter((unit: Unit) => unit.beds === selectedBedrooms)
      : availableUnits;

    const priceFiltered = selectedPriceStatus === 'listed'
      ? bedroomFiltered.filter((unit: Unit) => unit.price && unit.price.startsWith('$'))
      : selectedPriceStatus === 'unreleased'
      ? bedroomFiltered.filter(
          (unit: Unit) =>
            unit.price &&
            !unit.price.trim().startsWith('$') &&
            unit.price.trim().toLowerCase() !== 'sold'
        )
      : bedroomFiltered;

    setFilteredUnits(priceFiltered);
  }, [unitData, selectedBedrooms, selectedPriceStatus]);

  
  // Helper function to format square footage with commas and SF suffix
  const formatSquareFootage = (value: string | number) => {
    if (!value) return '';
    const num = typeof value === 'string' ? value.replace(/[^\d]/g, '') : value;
    const formatted = new Intl.NumberFormat().format(Number(num));
    return `${formatted} SF`;
  };

    const [propertySVGData, setPropertySVGData] = useState(null);

 useEffect(() => {
  const fetchPropertyData = async () => {
    try {
      const basePath = `/data/properties/${slug}`;
      console.log('🔍 Fetching property data for slug:', slug);
      console.log('🔍 Base path:', basePath);

      const [infoRes, floorplateRes, svgRes] = await Promise.all([
        fetch(`${basePath}/property-info.json?t=${Date.now()}`),
        fetch(`${basePath}/property-floorplates.json`),
        fetch(`${basePath}/property-svg.json`)
      ]);

      console.log('📊 Response statuses:', {
        info: infoRes.status,
        floorplate: floorplateRes.status,
        svg: svgRes.status
      });

      if (!infoRes.ok || !floorplateRes.ok || !svgRes.ok) {
        console.error("❌ One or more property data files failed to load.");
        console.error("Info response:", infoRes.status, infoRes.statusText);
        console.error("Floorplate response:", floorplateRes.status, floorplateRes.statusText);
        console.error("SVG response:", svgRes.status, svgRes.statusText);
        return;
      }

      const infoJson = await infoRes.json();
      const floorplateJson = await floorplateRes.json();
      const svgJson = await svgRes.json();
      
      console.log('✅ Successfully loaded property data:', {
        hasMetadata: !!infoJson.metadata,
        hasUnits: !!infoJson.units,
        unitsCount: infoJson.units?.length,
        hasFloorplates: !!floorplateJson,
        hasSVG: !!svgJson
      });

      setPropertyData(infoJson || {});
      setPropertyMetadata(infoJson.metadata || {});
      setPropertyFloorplates(floorplateJson || {});
      setPropertySVGData(svgJson || {});

      if (infoJson.units && Array.isArray(infoJson.units)) {
        setUnitData(infoJson.units);
      }

    } catch (error) {
      console.error('❌ Failed to load property data:', error);
    }
  };

  fetchPropertyData();
}, [slug]);




  useEffect(() => {
    if (hoveredUnit && hoverCardRef.current) {
      const cardWidth = hoverCardRef.current.offsetWidth;
      const cardHeight = hoverCardRef.current.offsetHeight;
      const offset = 15; // Offset from cursor

      // Calculate initial positions
      let newX = mouseX + offset;
      let newY = mouseY + offset;

      // Adjust for right edge
      if (newX + cardWidth > window.innerWidth) {
        newX = mouseX - cardWidth - offset;
      }

      // Adjust for bottom edge
      if (newY + cardHeight > window.innerHeight) {
        newY = mouseY - cardHeight - offset;
      }

      // Ensure card doesn't go off left or top edge
      newX = Math.max(10, newX);
      newY = Math.max(10, newY);

      setDisplayX(newX);
      setDisplayY(newY);
    }
  }, [hoveredUnit, mouseX, mouseY]);

  const handleUnitMouseEnter = (unitId: string, event: React.MouseEvent<SVGElement>) => {
    const unit = unitData.find(u => normalizeId(u.unit_id) === normalizeId(unitId));
    if (unit) {
      setHoveredUnit(unit);
      setMouseX(event.clientX);
      setMouseY(event.clientY);
    }
  };

  const handleUnitMouseLeave = () => {
    setHoveredUnit(null);
  };

  const handleUnitClick = (unitId: string) => {
    const unit = unitData.find(u => normalizeId(u.unit_id) === normalizeId(unitId));
    if (unit) {
      setSelectedUnit(unit);
      setIsUnitPageOpen(true);
      setHoveredUnit(null); // Hide hover card when opening unit page
    }
  };

  const handleCloseUnitPage = () => {
  setIsUnitPageOpen(false);
  setSelectedUnit(null);
};

const getPriceRange = (units: Unit[]) => {
  const validPrices = units
    .map(unit => unit.price)
    .filter(price => price && price !== 'Contact us' && price !== 'null')
    .map(price => parseFloat(price!.replace(/[$,]/g, '')))
    .filter(price => !isNaN(price)) as number[];
    
  if (validPrices.length === 0) return 'Contact us for pricing';

  const min = Math.min(...validPrices);
  const max = Math.max(...validPrices);

  const formatPrice = (price: number) => `$${price.toLocaleString()}`;
  return `${formatPrice(min)} - ${formatPrice(max)}`;
};

const getBedroomRange = (units: Unit[]) => {
  const beds = units.map(unit => unit.beds).filter(Boolean) as number[];
  if (beds.length === 0) return 'N/A';
  const min = Math.min(...beds);
  const max = Math.max(...beds);
  return min === max ? `${min} Beds` : `${min} - ${max} Beds`;
};

const getSqftRange = (units: Unit[]) => {
  const sqfts = units.map(unit => unit.interior_sqft).filter(Boolean) as number[];
  if (sqfts.length === 0) return 'N/A';
  const min = Math.min(...sqfts);
  const max = Math.max(...sqfts);
  const formatSqft = (sqft: number) => sqft.toLocaleString();
  return min === max ? formatSqft(min) : `${formatSqft(min)} - ${formatSqft(max)}`;
};

  const handleUnitCardClick = (unit: any) => {
    setSelectedUnit(unit);
    setIsUnitPageOpen(true);
  };

  const closeUnitPage = () => {
    setIsUnitPageOpen(false);
    setSelectedUnit(null);
  };

  const getUnitClass = (unitId: string) => {
  const unit = unitData.find(u => normalizeId(u.unit_id) === normalizeId(unitId));

  if (!unit) {
    console.warn(`No unit found for unit_id: ${unitId}`);
    return 'unit-grey';
  }

  if (!unit.price || unit.price === 'null') return 'unit-grey';
  if (unit.price === 'Contact us for price') return 'unit-blue';
  if (unit.price === 'Unreleased') return 'unit-blue';
  if (unit.price === 'Project on Hold') return 'unit-grey';
  if (unit.price === 'TBD') return 'unit-blue';
  if (unit.price.startsWith('$')) return 'unit-green';

  return 'unit-grey';
};

  const getFloorId = (floor: string) => {
    if (floor.length === 1) {
      return `0${floor}`;
    }
    return floor;
  };

const getFloorplanThumbnailPath = (unit: any) => {
  return getSafeImageSrc(unit?.thumbnail || '');
};

const filteredAndSortedUnits = useMemo(() => {
  if (!Array.isArray(unitData) || !selectedFloor) return [];

  const selectedFloorPadded = selectedFloor.padStart(2, '0'); // e.g., "06", "14"

  const floorUnits = unitData.filter((unit: Unit) => {
    const match = unit.unit_id.match(/__floor-(\d{2})__/);
    const unitFloor = match?.[1];
    return unitFloor === selectedFloorPadded;
  });

  return floorUnits.sort((a: Unit, b: Unit) => {
    const getPriority = (unit: Unit) => {
      if (!unit.price || unit.price === 'null') return 3;
      if (unit.price === 'Contact us for price') return 2;
      if (unit.price.startsWith('$')) return 1;
      return 3;
    };

    return getPriority(a) - getPriority(b);
  });
}, [unitData, selectedFloor]);

  useEffect(() => {
  if (!propertyFloorplates || !unitData || !selectedFloor) return;
}, [propertyFloorplates, unitData, selectedFloor]);

const getFloorplanImage = (floor: string) => {
  return propertyFloorplates?.[floor]?.image || '';
};

  const details = propertyData?.metadata;

  const [swiperModalOpen, setSwiperModalOpen] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(0);

  // Remove previous allImages/imageIndexMap logic
  // Build galleryImages array of all possible images
  const galleryImages: string[] = useMemo(() => {
    if (!imageFolders || !slug) return [];
    const images: string[] = [];
    
    // Collect all images from all folders in order
    imageFolders.forEach(folder => {
      for (let i = 1; i <= 20; i++) {
        const imagePath = `/assets/${slug}/${folder}/${String(i).padStart(2, '0')}.jpg`;
        images.push(imagePath);
      }
    });
    
    return images;
  }, [imageFolders, slug]);

  // Track only images that actually exist (successfully loaded)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingThumbnails, setExistingThumbnails] = useState<string[]>([]);
  
  // Filter gallery images to only show existing ones
  const filteredGalleryImages = useMemo(() => {
    return galleryImages.filter(src => existingImages.includes(src));
  }, [galleryImages, existingImages]);

  // Helper function to get thumbnail path
  const getThumbnailPath = (fullPath: string) => {
    // Convert full path to thumbnail path
    const pathParts = fullPath.split('/');
    const fileName = pathParts.pop(); // Get the filename
    const folderName = pathParts.pop(); // Get the folder name (residences, amenities, etc.)
    return [...pathParts, folderName, 'thumbnails', fileName].join('/');
  };

  // Helper function to get full-size image path
  const getFullSizePath = (thumbnailPath: string) => {
    // Convert thumbnail path back to full-size path
    const pathParts = thumbnailPath.split('/');
    const fileName = pathParts.pop(); // Get the filename
    pathParts.pop(); // Remove 'thumbnails'
    const folderName = pathParts.pop(); // Get the folder name
    return [...pathParts, folderName, fileName].join('/');
};

 if (!propertyData) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <Link to="/map">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Map
          </Button>
        </Link>
      </div>
    </div>
  );
}

  const hasVideo = !!propertyMetadata?.property_video;

  return (
    <div className="container mx-auto px-4 py-6 sm:px-4 sm:py-2">
      <style>{styles}</style>
      
      {/* Unit Hover Popup */}
      {hoveredUnit && !isUnitPageOpen && (
        <UnitHoverCard
          unit={hoveredUnit}
          x={displayX}
          y={displayY}
          hoverCardRef={hoverCardRef}
          formatSquareFootage={formatSquareFootage}
        />
      )}

      {/* Unit Page Modal/Full-page */}
      <UnitPage
        unit={selectedUnit}
        isOpen={isUnitPageOpen}
        onClose={closeUnitPage}
      />

      {/* Property Profile Header */}
        {propertyMetadata && (
          <PropertyHeader
            propertyMetadata={propertyMetadata}
            unitData={unitData}
            getPriceRange={getPriceRange}
            getBedroomRange={getBedroomRange}
            getSqftRange={getSqftRange}
          />
        )}

      {/* Fallback header for non-One Park Residences properties */}
      {!propertyMetadata && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{propertyData?.metadata?.property_name}</h1>
          {details && (
            <div className="text-lg text-gray-600">
              <p className="font-semibold text-blue-600">{details.price}</p>
              <p>{details.bedrooms} • {details.sqft}</p>
            </div>
          )}
        </div>
      )}

      
     <Tabs defaultValue="sitemap" className="w-full">
   <TabsList className={`grid w-full ${hasVideo ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="sitemap">Floorplans</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          {hasVideo && <TabsTrigger value="video">Video</TabsTrigger>}
        </TabsList>

  {/* Tab content sections below (leave as-is, or conditionally wrap like you did earlier) */}

    
        <TabsContent value="sitemap" className="mt-6">
          <Tabs defaultValue="floor-view" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="floor-view">Search By Floor</TabsTrigger>
              <TabsTrigger value="all-units">All Units</TabsTrigger>
            </TabsList>
            
            <TabsContent value="floor-view">
                <div className="space-y-6">
                  {propertyData && (
                    <div className="w-full">
                      <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                        <SelectTrigger className="select-trigger w-[280px] text-base font-semibold border-2 border-blue-500 focus:border-blue-600">
                          <SelectValue placeholder="Select Floor" />
                        </SelectTrigger>
                        <SelectContent>
                          {floorOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

  
              <div className="flex flex-col lg:flex-row gap-8 min-h-[500px] lg:h-[calc(100vh-200px)]">
                <div className="w-full lg:w-1/2 h-1/2 lg:h-full">
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 h-full relative p-4 flex flex-col justify-center">
                    {propertyMetadata?.has_floorplate_viewer && (
                      <FloorplateViewer
                        selectedFloor={selectedFloor}
                        propertyMetadata={propertyMetadata}
                        propertySVGData={propertySVGData}
                        getFloorplanImage={getFloorplanImage}
                        getUnitClass={getUnitClass}
                        handleUnitMouseEnter={handleUnitMouseEnter}
                        handleUnitMouseLeave={handleUnitMouseLeave}
                        handleUnitClick={handleUnitClick}
                      />
                    )}
                  </div>
                </div>
  
                <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col">
                  <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700 h-[70vh] lg:h-full flex flex-col">
                    <h3 className="text-lg font-semibold mb-1 px-4 pt-4 pb-1 text-gray-900 dark:text-white">
                      {floorOptions.find(option => option.value === selectedFloor)?.label || `Floor ${selectedFloor}`} Units
                    </h3>
                    <div className="overflow-y-auto p-4 space-y-4">
                      <FloorplateUnitList
                        units={filteredAndSortedUnits}
                        onUnitClick={handleUnitCardClick}
                        formatSquareFootage={formatSquareFootage}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </TabsContent>
          
            <TabsContent value="all-units">
              <AllUnitsTab
                filteredUnits={filteredUnits}
                selectedBedrooms={selectedBedrooms}
                setSelectedBedrooms={setSelectedBedrooms}
                selectedPriceStatus={selectedPriceStatus}
                setSelectedPriceStatus={(value: 'listed' | 'unreleased' | null) => setSelectedPriceStatus(value)}
                availableBedroomCounts={availableBedroomCounts}
                handleUnitClick={handleUnitClick}
                formatSquareFootage={formatSquareFootage}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <PropertyDetailsTab
            unitData={unitData}
            propertyMetadata={propertyMetadata}
            getPriceRange={getPriceRange}
            getBedroomRange={getBedroomRange}
            getSqftRange={getSqftRange}
          />
        </TabsContent>

        <TabsContent value="gallery" className="mt-6">
          <div>
            {imageFolders.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                  {filteredGalleryImages.map((src, idx) => {
                    const thumbnailPath = getThumbnailPath(src);
                  return (
                      <LazyLoad key={`gallery-${idx}`} height={256} offset={100} once>
                        <div>
                          <img
                            src={thumbnailPath}
                            alt={`Gallery image ${idx + 1}`}
                            className="rounded-lg shadow-sm object-cover w-full cursor-pointer transition-opacity"
                            onClick={() => {
                              setSwiperIndex(idx);
                              setSwiperModalOpen(true);
                            }}
                          />
                        </div>
                      </LazyLoad>
                    );
                  })}
                </div>
                {/* Hidden images to detect which ones exist */}
                <div style={{ display: 'none' }}>
                  {galleryImages.map((src, idx) => {
                    const thumbnailPath = getThumbnailPath(src);
                    return (
                          <img
                        key={`detector-${idx}`}
                        src={thumbnailPath}
                        onLoad={() => {
                          setExistingThumbnails(prev => 
                            prev.includes(thumbnailPath) ? prev : [...prev, thumbnailPath]
                          );
                          setExistingImages(prev => 
                            prev.includes(src) ? prev : [...prev, src]
                          );
                        }}
                        onError={() => {
                          // Image doesn't exist, don't add to arrays
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
                        onSlideChange={swiper => setSwiperIndex(swiper.activeIndex)}
                        modules={[Navigation, Pagination, Keyboard, EffectFade]}
                        effect="slide"
                        speed={300}
                        loop={true}
                      >
                        {filteredGalleryImages.map((src, idx) => (
                          <SwiperSlide key={`modal-slide-${idx}`}>
                            <div className="w-full h-full flex items-center justify-center bg-white">
                              <img
                                src={src}
                                alt={`Gallery image ${idx + 1}`}
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
            ) : (
              <div className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No images available for this property.</p>
                                  <div className="h-64 bg-gray-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">Gallery placeholder</span>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {hasVideo && (
          <TabsContent value="video" className="mt-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Property Video</h2>
              <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700 p-0 sm:p-6">
                {(() => {
                  const videoUrl = propertyMetadata?.property_video;
                  const youtubeId = videoUrl?.split('v=')[1]?.split('&')[0];
          
                  return youtubeId ? (
                    <div className="mx-auto w-full sm:w-[95%] md:w-[85%] lg:w-[75%] xl:w-[65%] aspect-video px-0 sm:px-4">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title="Property Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-none sm:rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <div className="text-lg font-medium mb-2">Video not available</div>
                        <div className="text-sm">The provided video URL is invalid or missing a YouTube ID.</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default PropertyProfile;