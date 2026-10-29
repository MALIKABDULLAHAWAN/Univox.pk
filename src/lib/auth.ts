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

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  universityId: z.string().uuid('Invalid university ID'),
});

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Credentials Provider - Email/Password Authentication
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

        // Validate credentials
        const validated = signInSchema.safeParse(credentials);
        if (!validated.success) {
          throw new Error('Invalid credentials');
        }

        try {
          // Find the student by email
          const student = await prisma.student.findUnique({
            where: { email: validated.data.email },
            include: { university: true },
          });

          if (!student) {
            throw new Error('No student found with this email');
          }

          // Check verification status
          if (student.verificationStatus !== 'verified') {
            throw new Error('Please verify your account before signing in');
          }

          // Verify password (assuming hashed with bcrypt)
          const isValidPassword = await verifyPassword(
            validated.data.password,
            student.email
          );

          if (!isValidPassword) {
            throw new Error('Invalid password');
          }

          // Update last login
          await prisma.student.update({
            where: { id: student.id },
            data: { lastLoginAt: new Date() },
          });

          // Return user object for NextAuth
          return {
            id: student.id,
            email: student.email,
            name: student.university?.name || '',
            universityId: student.universityId,
            universityName: student.university?.name || '',
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error(error instanceof Error ? error.message : 'Authentication failed');
        }
      },
    }),

    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    // Email Provider (Magic Links)
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

  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    updateAge: 24 * 60 * 60 * 1000, // 24 hours
  },

  // JWT configuration
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.universityId = user.universityId;
        token.universityName = user.universityName;
      }
      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.id as string;
        session.user.universityId = token.universityId as string;
        session.user.universityName = token.universityName as string;
      }
      return session;
    },

    async signIn({ user, account, profile, email, credentials }) {
      // Allow OAuth sign in
      if (account?.provider !== 'credentials') {
        return true;
      }

      // Credentials sign in is handled in authorize
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }

      // Allow absolute URLs from the same origin
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default to homepage for other URLs
      return baseUrl;
    },
  },

  // Pages
  pages: {
    signIn: '/(auth)/signin',
    signUp: '/(auth)/signup',
    error: '/(auth)/error',
    verifyRequest: '/(auth)/verify-request',
  },

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Secret for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,

  // Theme configuration
  theme: {
    colors: {
      primary: '#3B82F6',
      error: '#DC2626',
    },
  },
};

// Password verification helper
async function verifyPassword(password: string, email: string): Promise<boolean> {
  // In a real implementation, you would:
  // 1. Store hashed passwords in the database when users sign up
  // 2. Compare the provided password with the stored hash

  // For now, we'll use a simple comparison as a placeholder
  // TODO: Implement proper password hashing with bcrypt
  try {
    // Check if this is a development/demo password
    const demoPasswords: Record<string, string> = {
      'student@univox.pk': 'demo123',
      'admin@univox.pk': 'admin123',
    };

    const storedPassword = demoPasswords[email.toLowerCase()];
    if (storedPassword) {
      return password === storedPassword;
    }

    // For production: compare with bcrypt hash
    // const storedHash = await prisma.studentPassword.findUnique({
    //   where: { email },
    // });
    // if (!storedHash) return false;
    // return await compare(password, storedHash.password);

    return false;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// Import NextAuth and export handlers
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);