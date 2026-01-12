// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDataBase } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize function called with credentials:", credentials?.email); // Debug log

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password"); // Debug log
          throw new Error("Missing email or password");
        }

        try {
          await connectDataBase();
          console.log("Database connected successfully"); // Debug log
        } catch (error) {
          console.error("Database connection failed:", error); // Debug log
          throw new Error("Database connection failed");
        }

        let user;
        try {
          user = await User.findOne({ email: credentials.email });
          console.log(`User lookup result: ${user ? 'found' : 'not found'}`); // Debug log
        } catch (error) {
          console.error("User lookup failed:", error); // Debug log
          throw new Error("Database query failed");
        }

        if (!user) {
          console.log("No user found with this email"); // Debug log
          throw new Error("No user found with this email");
        }

        let isPasswordCorrect;
        try {
          isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log(`Password comparison result: ${isPasswordCorrect}`); // Debug log
        } catch (error) {
          console.error("Password comparison failed:", error); // Debug log
          throw new Error("Password validation failed");
        }

        if (!isPasswordCorrect) {
          console.log("Invalid password provided"); // Debug log
          throw new Error("Invalid password");
        }

        console.log("User authenticated successfully"); // Debug log

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // This callback runs after successful authorization but before session creation
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
