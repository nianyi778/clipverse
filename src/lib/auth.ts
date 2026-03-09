import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail, upsertGoogleUser } from "@/db/queries";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUserByEmail(credentials.email as string);
        if (!user) return null;

        if (!user.passwordHash) return null;

        const pw = credentials.password as string;
        let valid = false;
        if (user.passwordHash.startsWith("$2")) {
          valid = await bcrypt.compare(pw, user.passwordHash);
        } else {
          const sha = crypto.createHash("sha256").update(pw).digest("hex");
          valid = sha === user.passwordHash;
        }
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        await upsertGoogleUser({
          googleId: account.providerAccountId,
          email: profile.email,
          name: (profile.name as string) || "",
          avatarUrl: profile.picture as string | undefined,
        });
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account?.provider === "google") {
        const dbUser = await getUserByEmail(token.email as string);
        if (dbUser) {
          token.sub = dbUser.id;
        }
      }
      return token;
    },
  },
});
