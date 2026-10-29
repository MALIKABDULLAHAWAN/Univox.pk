// NextAuth route handler using App Router pattern
// Imports authOptions from lib/auth.ts
import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth';

// Export GET and POST handlers
export const GET = NextAuth(authOptions).GET;
export const POST = NextAuth(authOptions).POST;