import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft, LogOut, User, Star, Shield, Award } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions as any) as any;

  if (!session) {
    redirect('/(auth)/signin?callbackUrl=/profile');
  }

  const user = session?.user as any;
  const userId = (session as any)?.user?.id as string;

  // Fetch student details from database
  // This would typically be done in a server action or API route
  // For now, using mock data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              UniVox PK
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name || 'Student'}</h1>
                <p className="text-blue-100">{user.email}</p>
                <p className="text-blue-100 text-sm">{user.universityName || 'University Student'}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Star className="w-8 h-8 mx-auto text-yellow-400" />
                <p className="text-2xl font-bold text-gray-900">{user.credibilityScore || 1.0}</p>
                <p className="text-sm text-gray-500">Credibility</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Award className="w-8 h-8 mx-auto text-blue-400" />
                <p className="text-2xl font-bold text-gray-900">{user.reviewsCount || 0}</p>
                <p className="text-sm text-gray-500">Reviews</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="w-8 h-8 mx-auto text-green-400" />
                <p className="text-2xl font-bold text-gray-900">{user.verificationsMade || 0}</p>
                <p className="text-sm text-gray-500">Verifications</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <LogOut className="w-8 h-8 mx-auto text-purple-400" />
                <p className="text-2xl font-bold text-gray-900">{user.peerRatings || 0}</p>
                <p className="text-sm text-gray-500">Peer Ratings</p>
              </div>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Student ID</label>
                    <p className="text-gray-900">{user.studentIdHash}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">University</label>
                    <p className="text-gray-900">{user.universityName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Verification Status</label>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.verificationStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Edit Profile
                  </button>
                  <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Change Password
                  </button>
                  <button className="w-full py-2 px-4 border border-red-300 rounded-lg text-red-700 hover:bg-red-50">
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}