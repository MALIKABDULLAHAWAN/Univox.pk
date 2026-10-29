import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Type declarations for NextAuth session extension
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      universityId: string;
      universityName: string;
    };
  }

  interface JWT {
    id?: string;
    universityId?: string;
    universityName?: string;
  }
}

// Auth options configuration
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authOptions: any = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'student@university.edu.pk',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const validated = signInSchema.safeParse(credentials);
        if (!validated.success) {
          throw new Error('Invalid credentials');
        }

        try {
          const passwordRecord = await prisma.password.findUnique({
            where: { email: validated.data.email.toLowerCase() },
          });

          if (!passwordRecord) {
            return null;
          }

          const isValidPassword = await compare(
            validated.data.password,
            passwordRecord.password
          );
          if (!isValidPassword) {
            return null;
          }

          const student = await prisma.student.findUnique({
            where: { email: validated.data.email.toLowerCase() },
            include: { university: true },
          });

          if (!student) {
            return null;
          }

          if (student.verificationStatus !== 'verified') {
            throw new Error('Please verify your account before signing in');
          }

          await prisma.student.update({
            where: { id: student.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: student.id,
            email: student.email,
            name: student.university?.name || '',
            universityId: student.universityId,
            universityName: student.university?.name || '',
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || 'localhost',
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        secure: process.env.EMAIL_SERVER_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@univox.pk',
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    updateAge: 24 * 60 * 60 * 1000,
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }: { token: Record<string, unknown>; user?: Record<string, unknown> }) {
      if (user) {
        token.id = user.id;
        token.universityId = (user as Record<string, unknown>).universityId;
        token.universityName = (user as Record<string, unknown>).universityName;
      }
      return token;
    },

    async session({ session, token }: { session: { user: Record<string, unknown> }; token: Record<string, unknown> }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.universityId = (token as Record<string, unknown>).universityId as string;
        session.user.universityName = (token as Record<string, unknown>).universityName as string;
      }
      return session;
    },

    async signIn() {
      return true;
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return baseUrl;
    },
  },

  pages: {
    signIn: '/(auth)/signin',
    error: '/(auth)/error',
    verifyRequest: '/(auth)/verify-request',
  },

  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colors: {
      primary: '#3B82F6',
      error: '#DC2626',
    },
  },
};

// Export handlers for the App Router
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);