import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { useState } from 'react';

type SignInCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = {
  email: string;
  password: string;
  confirmPassword: string;
  universityId: string;
  studentIdHash: string;
  agreeToTerms: boolean;
};

type User = {
  id: string;
  email: string | null;
  name?: string | null;
  image?: string | null;
  universityId?: string;
  universityName?: string;
};

type AuthState = {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
};

export function useAuth() {
  const { data: session, status } = useSession();

  const authState: AuthState = {
    user: session?.user as User | null,
    status: status === 'loading' ? 'loading' : session ? 'authenticated' : 'unauthenticated',
  };

  return authState;
}

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(credentials: SignInCredentials, redirectTo?: string) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await nextAuthSignIn('credentials', {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
        callbackUrl: redirectTo,
      });

      if (result?.error) {
        const errorMessage = typeof result.error === 'string'
          ? result.error
          : (result.error as { message?: string }).message || 'Sign in failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle(redirectTo?: string) {
    setIsLoading(true);
    setError(null);

    try {
      await nextAuthSignIn('google', {
        callbackUrl: redirectTo,
      });
      return { success: true };
    } catch (err) {
      const errorMessage = 'Google sign in failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }

  return { signIn, signInWithGoogle, isLoading, error };
}

export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);

  async function signOut(redirectTo?: string) {
    setIsLoading(true);
    if (redirectTo) {
      await nextAuthSignOut({ redirect: true, callbackUrl: redirectTo });
    } else {
      await nextAuthSignOut({ redirect: true });
    }
    setIsLoading(false);
  }

  return { signOut, isLoading };
}

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signUp(credentials: SignUpCredentials) {
    setIsLoading(true);
    setError(null);

    try {
      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          universityId: credentials.universityId,
          studentIdHash: credentials.studentIdHash,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      return { success: true, message: data.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }

  return { signUp, isLoading, error };
}