export interface Interest {
    id: string;
    name: string;
    // ... other interest fields
  }

  export interface Asset {
    id: string;
    url: string;
    type: string;
    // ... other asset fields
  }

export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface User {
  _id: string;
  full_name?: string;
  username?: string;
  email?: string;
  profile_image?: string;
  profile_image_asset?: Asset;
  bio?: string;
  location?: Location;
  is_onboarded?: boolean;
  user_type?: 'user' | 'admin';
  interests?: Interest[];
  google_id?: string;
  is_email_verified?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

// You might also want a minimal version for lists/cards
export interface UserPreview {
  _id: string;
  full_name?: string;
  username?: string;
  profile_image?: string;
  bio?: string;
}

// For cases where you know the references aren't populated
export interface UnpopulatedUser extends Omit<User, 'interests' | 'profile_image_asset'> {
  interests?: string[];
  profile_image_asset?: string;
}

