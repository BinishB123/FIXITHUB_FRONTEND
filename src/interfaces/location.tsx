export interface getsuggetionResponse {
    country: {
      id: string;
      name: string;
      country_code: string;
      country_code_alpha_3: string;
    };
    district: {
      id: string;
      name: string;
    };
    region: {
      id: string;
      name: string;
      region_code: string;
      region_code_full: string;
    };
    distance: number;
    feature_type: string;
    language: string;
    maki: string;
    mapbox_id: string;
    metadata: Record<string, unknown>; // Empty object or generic key-value pair
    place_formatted: string;
    name: string;
   
  }
     

  export  interface SuggestionItem {
    country: {
        id: string;
        name: string;
        country_code: string;
        country_code_alpha_3: string;
      };
      district: {
        id: string;
        name: string;
      };
      region: {
        id: string;
        name: string;
        region_code: string;
        region_code_full: string;
      };
      distance: number;
      feature_type: string;
      language: string;
      maki: string;
      mapbox_id: string;
      metadata: Record<string, unknown>; // Empty object or generic key-value pair
      place_formatted: string;
      name: string;
    
    // Add other properties if they exist in each item
  }
  