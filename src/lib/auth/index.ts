// Auth module exports

// Main auth configuration
export { authOptions, handlers, auth, signIn, signOut } from '../auth';

// Types
export type { AuthOptions } from 'next-auth';

// Note: getServerSession is from next-auth/next (server-side only)
// import { getServerSession } from 'next-auth/next';