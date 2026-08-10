import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type LoginApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      profileImage: string;
      refreshToken: string;
    };
    accessToken: string;
  };
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User> {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please enter your email and password");
        }

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) {
          throw new Error("Backend URL is not configured");
        }

        try {
          const response = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email.trim().toLowerCase(),
              password: credentials.password,
            }),
            cache: "no-store",
          });

          const result = (await response.json()) as LoginApiResponse;

          if (!response.ok || !result.success || !result.data) {
            throw new Error(result.message || "INVALID_CREDENTIALS");
          }

          const { user, accessToken } = result.data;
          const role = user.role.toUpperCase();

          if (role !== "ADMIN") {
            throw new Error("ADMIN_ONLY");
          }

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role,
            profileImage: user.profileImage,
            accessToken,
            refreshToken: user.refreshToken,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Authentication failed. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.profileImage = user.profileImage;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        profileImage: token.profileImage,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
