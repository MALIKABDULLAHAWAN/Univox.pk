'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { z } from 'zod';
import { Loader2, Mail, Lock, User, Building, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  universityId: z.string().cuid('Invalid university ID'),
  studentIdHash: z.string().min(1, 'Student ID is required'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [studentIdHash, setStudentIdHash] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [universities, setUniversities] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';

  useEffect(() => {
    async function fetchUniversities() {
      try {
        const response = await fetch('/api/universities');
        if (response.ok) {
          const data = await response.json();
          setUniversities(data.universities || data);
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    }

    fetchUniversities();
  }, []);

  useEffect(() => {
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      setError(getErrorMessage(errorParam));
    }
  }, [searchParams]);

  function getErrorMessage(error: string): string {
    switch (error) {
      case 'EmailExists':
        return 'This email is already registered. Please sign in.';
      case 'StudentIdExists':
        return 'This student ID is already registered.';
      case 'StudentNotFound':
        return 'Student ID not found. Please verify your university ID.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Password confirmation check
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const validation = signUpSchema.safeParse({
      email,
      password,
      universityId,
      studentIdHash,
      agreeToTerms,
    });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      // Check if student exists
      const existingStudent = await prisma.student.findFirst({
        where: {
          OR: [
            { email: validation.data.email.toLowerCase() },
            { studentIdHash: validation.data.studentIdHash },
          ],
        },
      });

      if (existingStudent) {
        if (existingStudent.email === validation.data.email.toLowerCase()) {
          setError('This email is already registered. Please sign in.');
          return;
        }
        setError('This student ID is already registered.');
        return;
      }

      // Check if university exists
      const university = await prisma.university.findUnique({
        where: { id: validation.data.universityId },
      });

      if (!university) {
        setError('Invalid university selected');
        return;
      }

      // Hash password
      const hashedPassword = await hash(validation.data.password, 12);

      // Create student account
      const student = await prisma.student.create({
        data: {
          email: validation.data.email.toLowerCase(),
          universityId: validation.data.universityId,
          studentIdHash: validation.data.studentIdHash,
          verificationStatus: 'pending', // Will need email verification
        },
      });

      // Store password
      await prisma.password.create({
        data: {
          email: validation.data.email.toLowerCase(),
          password: hashedPassword,
        },
      });

      setSuccess('Account created successfully! Please check your email to verify your account.');

      setTimeout(() => {
        router.push('/(auth)/signin');
      }, 3000);
    } catch (error) {
      console.error('Sign up error:', error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setForgotPasswordSuccess(false);

    const validation = ForgotPasswordSchema.safeParse({ email: forgotPasswordEmail });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setForgotPasswordLoading(true);

    try {
      // Placeholder for password reset email
      await new Promise(resolve => setTimeout(resolve, 1000));

      setForgotPasswordSuccess(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      }, 3000);
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Reset Your Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {forgotPasswordSuccess ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    If an account exists with this email, a reset link has been sent.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-lg relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email address"
                    value={forgotPasswordEmail}
                    onChange={e => setForgotPasswordEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={forgotPasswordLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {forgotPasswordLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {success}
          </h2>
          <div className="mt-8">
            <button
              onClick={() => router.push('/(auth)/signin')}
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign In Now
            </button>
          </div>
          <div className="mt-4">
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              href="/(auth)/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="university" className="sr-only">
                University
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  id="university"
                  name="universityId"
                  required
                  className="appearance-none rounded-lg relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  value={universityId}
                  onChange={e => setUniversityId(e.target.value)}
                >
                  <option value="">Select your university</option>
                  {universities.map(university => (
                    <option key={university.id} value={university.id}>
                      {university.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="studentIdHash" className="sr-only">
                Student ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="studentIdHash"
                  name="studentIdHash"
                  type="text"
                  autoComplete="off"
                  required
                  className="appearance-none rounded-lg relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your student ID/hash"
                  value={studentIdHash}
                  onChange={e => setStudentIdHash(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={agreeToTerms}
                  onChange={e => setAgreeToTerms(e.target.checked)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-gray-700">
                  I agree to the{' '}
                  <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

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

export default function SignUpPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpPage />
    </Suspense>
  );
}