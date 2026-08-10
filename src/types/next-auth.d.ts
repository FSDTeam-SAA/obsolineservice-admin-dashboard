import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: string;
    profileImage: string;
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      profileImage: string;
      accessToken: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    profileImage: string;
    accessToken: string;
    refreshToken: string;
  }
}
