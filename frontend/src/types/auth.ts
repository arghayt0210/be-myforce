import { RegisterInput } from "@/schemas/auth.schema";
import { UnpopulatedUser } from "./user";

export interface SignUpFormValues extends RegisterInput {
    profile_image?: File
}

// Add this new type
export type SignUpPayload = FormData;

export type AuthResponse = Omit<UnpopulatedUser, 'interests' | 'location'> & {
    interests: never[]; // empty during registration
    location: null; // not set during registration
  };