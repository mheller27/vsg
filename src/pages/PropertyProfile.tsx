import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Minus, RotateCcw, Phone, Video, Heart, Bell } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useMemo, useRef } from 'react';
import UnitPage from '../components/UnitPage';
import { getSafeImageSrc } from '../lib/fallbackImage'; // or the correct relative path
import PropertyHeader from '../components/PropertyProfileHeader';
import UnitHoverCard from '../components/UnitHoverCard';
import FloorplateUnitList from '../components/FloorplateUnitList';
import AllUnitsTab from '../components/AllUnitsTab';
import FloorplateViewer from '../components/FloorplateViewer';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import LazyLoad from 'react-lazyload';

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
        fetch(`${basePath}/property-info.json`),
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
  return `From ${formatPrice(min)} - ${formatPrice(max)}`;
};

const getBedroomRange = (units: Unit[]) => {
  const beds = units.map(unit => unit.beds).filter(Boolean) as number[];
  if (beds.length === 0) return 'N/A';
  const min = Math.min(...beds);
  const max = Math.max(...beds);
  return min === max ? `${min} Bedrooms` : `${min} - ${max} Bedrooms`;
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

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Remove previous allImages/imageIndexMap logic
  // Build galleryImages array of all possible images
  const galleryImages: string[] = useMemo(() => {
    if (!imageFolders || !slug) return [];
    const images: string[] = [];
    imageFolders.forEach(folder => {
      for (let i = 1; i <= 20; i++) {
        images.push(`/assets/${slug}/${folder}/${String(i).padStart(2, '0')}.jpg`);
      }
    });
    return images;
  }, [imageFolders, slug]);

  // Track only images that actually exist (successfully loaded)
  const [existingImages, setExistingImages] = useState<string[]>([]);

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

  return (
    <div className="container mx-auto px-4 py-8">
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

      <div className="mb-6">
        <Link to="/map">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Map
          </Button>
        </Link>
      </div>

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
   <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>

  {/* Tab content sections below (leave as-is, or conditionally wrap like you did earlier) */}

    
        <TabsContent value="sitemap" className="mt-6">
          <Tabs defaultValue="floor-view" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="floor-view">Search By Floor</TabsTrigger>
              <TabsTrigger value="all-units">All Available Units</TabsTrigger>
            </TabsList>
            
            <TabsContent value="floor-view">
                <div className="space-y-6">
                  {propertyData && (
                    <div className="w-full">
                      <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                        <SelectTrigger className="w-[280px] text-base font-semibold">
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

  
              <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-200px)]">
                <div className="w-full lg:w-1/2 h-1/2 lg:h-full">
                  <div className="bg-neutral-100 rounded-lg border border-gray-200 h-full relative p-4 flex flex-col justify-center">
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
                  <div className="bg-gray-50 rounded-lg border border-gray-200 h-[70vh] lg:h-full flex flex-col">
                    <h3 className="text-lg font-semibold mb-1 px-4 pt-4 pb-1">Available Units</h3>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Facts</h2>
              <div className="space-y-3 text-gray-700">
                <div>
                  <span className="font-bold">Price Range:</span>{' '}
                  {getPriceRange(unitData)}
                </div>
                <div>
                  <span className="font-bold">Bedrooms:</span>{' '}
                  {getBedroomRange(unitData)}
                </div>
                <div>
                  <span className="font-bold">SF Range:</span>{' '}
                  {getSqftRange(unitData)}
                </div>
                <div>
                  <span className="font-bold">Developer:</span>{' '}
                  {propertyMetadata?.developer || 'N/A'}
                </div>
                <div>
                  <span className="font-bold">Unit Total:</span>{' '}
                  {unitData.length}
                </div>
                <div>
                  <span className="font-bold">Estimated Completion Date:</span>{' '}
                  {propertyMetadata?.estimated_completion_date || 'N/A'}
                </div>
              </div>
            </div>
          </div>
            {propertyMetadata && (
              <div className="mt-10 space-y-6">
                {[
                  { title: "Property Details", items: propertyMetadata.property_details },
                  { title: "Amenity Details", items: propertyMetadata.amenity_details },
                  { title: "Developer Details", items: propertyMetadata.developer_details },
                  { title: "Architect Details", items: propertyMetadata.architect_details },
                  { title: "Builder Details", items: propertyMetadata.builder_details },
                  { title: "Designer Details", items: propertyMetadata.designer_details },
                ].map(({ title, items }) => (
                  <div key={title}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {items?.map((item, index) => (
                        <li key={index} className="text-gray-800">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
        </TabsContent>

        <TabsContent value="gallery" className="mt-6">
          <div>
            {imageFolders.length > 0 ? (
              <div className="space-y-8">
                {imageFolders.map((folder) => {
                  const images = Array.from({ length: 20 }, (_, i) => 
                    `/assets/${slug}/${folder}/${String(i + 1).padStart(2, '0')}.jpg`
                  );
        
                  return (
                    <div key={folder}>
                      <h3 className="text-xl font-bold capitalize mb-3">{folder.replace(/-/g, ' ')}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((src, idx) => (
                          <img
                            key={`${folder}-${idx}`}
                            src={src}
                            alt={`${folder} image ${idx + 1}`}
                            className="rounded-lg shadow-sm object-cover w-full h-64"
                            onLoad={() => {
                              setExistingImages(prev => prev.includes(src) ? prev : [...prev, src]);
                            }}
                            onClick={() => {
                              const index = existingImages.indexOf(src);
                              if (index !== -1) {
                                setPhotoIndex(index);
                                setLightboxOpen(true);
                              }
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none'; // Hide if image doesn't exist
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">No images available for this property.</p>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Gallery placeholder</span>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="video" className="mt-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Property Video</h2>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              {(() => {
                const videoUrl = propertyMetadata?.property_video;
                const youtubeId = videoUrl?.split('v=')[1]?.split('&')[0];
        
                return youtubeId ? (
                  <div className="mx-auto w-full sm:w-[95%] md:w-[85%] lg:w-[75%] xl:w-[65%] aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title="Property Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
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
          </div>
        </TabsContent>
      </Tabs>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={existingImages.map(src => ({ src }))}
        index={photoIndex}
        on={{ view: ({ index }) => setPhotoIndex(index) }}
      />
    </div>
  );
};

export default PropertyProfile;