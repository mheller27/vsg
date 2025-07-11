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
    {/* Top row: Quick Facts + Map */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Facts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col">
            <span className="font-bold text-sm text-gray-500 mb-1">Price Range</span>
            <span className="text-lg">{getPriceRange(unitData)}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col">
            <span className="font-bold text-sm text-gray-500 mb-1">Bedrooms</span>
            <span className="text-lg">{getBedroomRange(unitData)}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col">
            <span className="font-bold text-sm text-gray-500 mb-1">SQFT Range</span>
            <span className="text-lg">{getSqftRange(unitData)}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col">
            <span className="font-bold text-sm text-gray-500 mb-1">Developer</span>
            <span className="text-lg">{propertyMetadata?.developer || 'N/A'}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col">
            <span className="font-bold text-sm text-gray-500 mb-1">Unit Total</span>
            <span className="text-lg">{unitData.length}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col">
            <span className="font-bold text-sm text-gray-500 mb-1">Estimated Completion Date</span>
            <span className="text-lg">{propertyMetadata?.estimated_completion_date || 'N/A'}</span>
          </div>
        </div>
      </div>
      {propertyMetadata?.property_coordinates && (
        <PropertyLocationMap coordinates={propertyMetadata.property_coordinates} />
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
            <div key={title} className="bg-white rounded-lg shadow p-6">
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
