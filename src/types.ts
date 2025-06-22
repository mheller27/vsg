export interface EnhancedLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  imageUrl?: string;
  imageUrls?: string[];
}

export interface Unit {
  unit_id: string;
  Residence?: string; // Capital R for one-park
  residence?: string; // Lowercase r for ritz-carlton
  type?: string;
  unit?: string | number;
  beds?: number;
  baths?: number;
  den?: boolean | string;
  bonus_room?: boolean | string;
  interior_sqft?: number | string;
  exterior_sqft?: number | string;
  total_sqft?: number | string;
  availability?: string;
  price?: string;
  floorplan_pdf?: string;
  photos?: string[] | null;
  video?: string | null;
  floorplan_thumbnail?: string;
}

export interface PropertyMetadata {
  property_name: string;
  profile_image?: string;
  developer?: string;
  property_video?: string;
  estimated_completion_date?: string;
  imageFolders?: string[];
  has_floorplate_viewer?: boolean;
  property_details?: string[];
  amenity_details?: string[];
  developer_details?: string[];
  architect_details?: string[];
  builder_details?: string[];
}

export interface FloorOption {
  label: string;
  value: string;
}

export interface PropertyInfo {
  metadata: PropertyMetadata;
  floorOptions: FloorOption[];
  units: Unit[];
}
