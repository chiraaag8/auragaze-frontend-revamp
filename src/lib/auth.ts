import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import type { AuthOptions } from "next-auth";

export const authConfig: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) return null;

        const validPassword = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!validPassword) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }

      return session;
    },
  },
};
