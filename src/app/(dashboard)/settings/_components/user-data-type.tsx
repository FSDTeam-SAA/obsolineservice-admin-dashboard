export interface UserProfileApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: UserProfile;
  responseTime: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  username?: string;
  email: string;
  dob: string | null;
  phone: string | null;
  gender: "male" | "female" | "other";
  role: string;
  stripeAccountId: string | null;
  bio: string;
  profileImage: string;
  multiProfileImage: string[];
  pdfFile: string;
  otp: string | null;
  otpExpires: string | null;
  otpVerified: boolean;
  resetExpires: string | null;
  isVerified: boolean;
  refreshToken: string;
  hasActiveSubscription: boolean;
  subscriptionExpireDate: string | null;
  blockedUsers: string[];
  language: string;
  address: Address;
}

export interface Address {
  country: string;
  cityState: string;
  roadArea: string;
  postalCode: string;
  taxId: string;
}

export const USER_PROFILE_QUERY_KEY = ["user-profile"] as const;
