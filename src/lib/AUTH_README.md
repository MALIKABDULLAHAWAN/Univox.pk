# UniVox PK Authentication Module

This authentication module implements a comprehensive NextAuth.js setup for the UniVox PK platform using the Next.js 14 App Router pattern.

## Features

- Email/Password authentication with credentials provider
- Google OAuth support
- Email magic link authentication
- JWT session handling
- Prisma adapter integration
- Session context provider
- Protected routes with middleware
- Server-side session handling

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts    # Main NextAuth configuration
│   │       ├── signup/route.ts           # User registration endpoint
│   │       ├── signout/route.ts          # Sign out endpoint
│   │       └── status/route.ts           # Auth status check endpoint
│   ├── (auth)/
│   │   ├── layout.tsx                    # Auth pages layout
│   │   ├── signin/page.tsx               # Sign in page
│   │   ├── signup/page.tsx               # Sign up page
│   │   ├── error/page.tsx                # Error page
│   │   └── verify-request/page.tsx       # Magic link verification page
│   ├── dashboard/
│   │   └── page.tsx                      # Protected dashboard example
│   └── profile/
│       └── page.tsx                      # Protected profile page
├── lib/
│   ├── auth.ts                           # NextAuth configuration
│   ├── auth-context.tsx                  # Session provider HOC
│   └── use-auth.ts                       # Auth hooks
├── middleware.ts                         # Route protection middleware
└── prisma/
    └── schema.prisma                     # Updated with NextAuth models
```

## Setup

### Environment Variables

Add the following to your `.env` file:

```env
# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/univox_pk?schema=public"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Provider (optional)
EMAIL_SERVER="smtp://user:pass@localhost:587"
EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_SECURE="false"
EMAIL_SERVER_USER="your-smtp-user"
EMAIL_SERVER_PASSWORD="your-smtp-password"
EMAIL_FROM="noreply@univox.pk"
```

### Database Setup

Run the Prisma migration to create the authentication tables:

```bash
npx prisma migrate dev --name init
# or for production
npx prisma migrate deploy
```

## Usage

### Protecting Routes

#### Server-Side Protection

```tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/(auth)/signin?callbackUrl=/protected');
  }

  return <div>Protected content</div>;
}
```

#### Client-Side Protection

```tsx
import { useAuth } from '@/lib/use-auth';

export default function ClientProtectedPage() {
  const { user, status } = useAuth();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    // Redirect to sign in or show message
    return <div>Please sign in to continue</div>;
  }

  return <div>Hello, {user?.email}</div>;
}
```

### Using Auth Hooks

```tsx
import { useSignIn, useSignOut, useSignUp } from '@/lib/use-auth';

export default function AuthForm() {
  const { signIn, isLoading, error } = useSignIn();
  const { signOut, isLoading: isSigningOut } = useSignOut();
  const { signUp, isLoading: isSigningUp } = useSignUp();

  const handleSignIn = async () => {
    const result = await signIn({ email: 'user@example.com', password: 'password' });
    if (result.success) {
      console.log('Signed in!');
    }
  };
}
```

### Middleware Protection

The middleware at `src/middleware.ts` protects all routes except public ones. Configure protected paths by modifying the `publicRoutes` array.

## API Endpoints

### POST /api/auth/signup
Register a new user

**Body:**
```json
{
  "email": "student@university.edu.pk",
  "password": "secure-password",
  "universityId": "clxxx...",
  "studentIdHash": "student-123"
}
```

### GET /api/auth/status
Check current authentication status

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": "clxxx...",
    "email": "student@university.edu.pk",
    "name": "University Name"
  }
}
```

### POST /api/auth/signout
Sign out the current user

## Security Considerations

1. **Password Hashing**: Uses bcrypt with 12 rounds
2. **Session Security**: JWT tokens with 30-day expiration
3. **CSRF Protection**: Built-in NextAuth CSRF protection
4. **Rate Limiting**: Recommended to add rate limiting in production

## Production Checklist

- [ ] Set `NEXTAUTH_SECRET` to a strong random value
- [ ] Configure proper `NEXTAUTH_URL` (e.g., https://univox.pk)
- [ ] Set up Google OAuth credentials
- [ ] Configure email provider for magic links
- [ ] Add rate limiting to auth endpoints
- [ ] Implement password reset flow
- [ ] Add email verification
- [ ] Set up security headers
- [ ] Review session cookie settings