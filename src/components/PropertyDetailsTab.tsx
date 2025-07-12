import React from 'react';
import PropertyLocationMap from './PropertyLocationMap'; // adjust path if needed

interface PropertyDetailsTabProps {
  unitData: any[];
  propertyMetadata: any;
  getPriceRange: (units: any[]) => string;
  getBedroomRange: (units: any[]) => string;
  getSqftRange: (units: any[]) => string;
}

const PropertyDetailsTab: React.FC<PropertyDetailsTabProps> = ({
  unitData,
  propertyMetadata,
  getPriceRange,
  getBedroomRange,
  getSqftRange,
}) => (
  <div>
    {/* Desktop Layout: Quick Facts + Map */}
    <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Facts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
          <div className="bg-gray-50 rounded-lg shadow p-4 flex flex-col">
            <span className="font-bold text-sm text-gray-700 mb-1">Price Range</span>
            <span className="text-lg">{getPriceRange(unitData)}</span>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4 flex flex-col">
            <span className="font-bold text-sm text-gray-700 mb-1">Bedrooms</span>
            <span className="text-lg">{getBedroomRange(unitData)}</span>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4 flex flex-col">
            <span className="font-bold text-sm text-gray-700 mb-1">SQFT Range</span>
            <span className="text-lg">{getSqftRange(unitData)}</span>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4 flex flex-col">
            <span className="font-bold text-sm text-gray-700 mb-1">Developer</span>
            <span className="text-lg">{propertyMetadata?.developer || 'N/A'}</span>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4 flex flex-col">
            <span className="font-bold text-sm text-gray-700 mb-1">Unit Total</span>
            <span className="text-lg">{unitData.length}</span>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4 flex flex-col">
            <span className="font-bold text-sm text-gray-700 mb-1">Estimated Completion Date</span>
            <span className="text-lg">{propertyMetadata?.estimated_completion_date || 'N/A'}</span>
          </div>
        </div>
      </div>
      {propertyMetadata?.property_coordinates && (
        <PropertyLocationMap coordinates={propertyMetadata.property_coordinates} />
      )}
    </div>

    {/* Mobile Layout: Quick Facts + Map */}
    <div className="lg:hidden">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Quick Facts</h2>
        <div className="grid grid-cols-2 gap-2 text-gray-700">
          <div className="bg-gray-50 rounded-lg shadow p-2 flex flex-col">
            <span className="font-bold text-xs text-gray-700 mb-0.5">Price Range</span>
            <span className="text-xs">{getPriceRange(unitData)}</span>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-2 flex flex-col">
            <span className="font-bold text-xs text-gray-700 mb-0.5">Bedrooms</span>
            <span className="text-xs">{getBedroomRange(unitData)}</span>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-2 flex flex-col">
            <span className="font-bold text-xs text-gray-700 mb-0.5">SQFT Range</span>
            <span className="text-xs">{getSqftRange(unitData)}</span>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-2 flex flex-col">
            <span className="font-bold text-xs text-gray-700 mb-0.5">Developer</span>
            <span className="text-xs">{propertyMetadata?.developer || 'N/A'}</span>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-2 flex flex-col">
            <span className="font-bold text-xs text-gray-700 mb-0.5">Unit Total</span>
            <span className="text-xs">{unitData.length}</span>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-2 flex flex-col">
            <span className="font-bold text-xs text-gray-700 mb-0.5">Completion Date</span>
            <span className="text-xs">{propertyMetadata?.estimated_completion_date || 'N/A'}</span>
          </div>
        </div>
      </div>
      {propertyMetadata?.property_coordinates && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Location</h2>
          <PropertyLocationMap coordinates={propertyMetadata.property_coordinates} />
        </div>
      )}
    </div>
    {/* Details sections below */}
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
          Array.isArray(items) && items.length > 0 ? (
            <div key={title} className="bg-gray-50 rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <div className="space-y-2">
                {items.map((item: string, index: number) => (
                  <div key={index} className="text-gray-800">{item}</div>
                ))}
              </div>
            </div>
          ) : null
        ))}
      </div>
    )}
  </div>
);

export default PropertyDetailsTab;
