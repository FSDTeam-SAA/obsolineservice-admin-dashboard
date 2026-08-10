export interface UserProfileApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IUser;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  bio: string;
  profilePicture: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  verifiedForget: boolean;
  gender: "male" | "female";
  location: string;
  phoneNumber: string;
  postalCode: string;
  streetAddress: string;
}