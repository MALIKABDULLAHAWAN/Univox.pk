'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft, RefreshCw, ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams?.get('error');

  const errorMessages: Record<string, { title: string; message: string }> = {
    VerificationNeeded: {
      title: 'Email Verification Required',
      message: 'Please check your email and verify your account before signing in.',
    },
    AccessDenied: {
      title: 'Access Denied',
      message: 'Your account does not have permission to access this resource.',
    },
    Configuration: {
      title: 'Configuration Error',
      message: 'There is a problem with the authentication configuration. Please contact support.',
    },
    OAuthAccountNotLinked: {
      title: 'Account Not Linked',
      message: 'This OAuth account has not been linked to your profile. Please use another sign-in method.',
    },
    EmailSignin: {
      title: 'Email Sign-In Error',
      message: 'There was an error sending the sign-in email. Please try again.',
    },
    Test: {
      title: 'Test Error',
      message: 'This is a test error message.',
    },
  };

  const errorInfo = errorMessages[error || ''] || {
    title: 'Authentication Error',
    message: 'An unexpected error occurred during authentication. Please try again.',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <ShieldAlert className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{errorInfo.title}</h2>
          <p className="mt-2 text-sm text-gray-600">{errorInfo.message}</p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => router.refresh()}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </button>

          <Link
            href="/(auth)/signin"
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Sign In
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorPage />
    </Suspense>
  );
}