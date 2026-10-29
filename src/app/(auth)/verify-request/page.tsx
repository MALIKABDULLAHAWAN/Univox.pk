import { useSearchParams } from 'next/navigation';
import { Mail, CheckCircle } from 'lucide-react';

export default function VerifyRequestPage() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mb-6 flex justify-center">
          <Mail className="h-16 w-16 text-blue-600" />
        </div>

        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Check your email
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          We've sent a verification link to{' '}
          <span className="font-medium text-gray-900">{email || 'your email'}</span>.
        </p>

        <div className="mt-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Did you receive the email?</h3>
            <div className="space-y-3">
              <button className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Verify Email
              </button>
              <button className="w-full py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Resend Verification Email
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Didn't receive the email? Check your spam folder or</p>
          <button className="mt-1 text-blue-600 hover:text-blue-500 font-medium">
            Request a new verification link
          </button>
        </div>
      </div>
    </div>
  );
}