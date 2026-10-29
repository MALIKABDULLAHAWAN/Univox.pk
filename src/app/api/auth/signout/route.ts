import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Type assertion needed for NextAuth v4 with App Router
    const session = await getServerSession(authOptions as any) as any;

    if (session) {
      // You could add cleanup logic here if needed
      // For example: clear session data, update last logout time, etc.
    }

    // Return success - actual signout is handled by next-auth/react
    return NextResponse.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Error during signout:', error);
    return NextResponse.json(
      { error: 'An error occurred during signout' },
      { status: 500 }
    );
  }
}