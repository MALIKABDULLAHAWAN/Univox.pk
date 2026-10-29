import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Type assertion needed for NextAuth v4 with App Router
    const session = await getServerSession(authOptions as any) as any;

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    const user = session.user as Record<string, unknown>;

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        universityId: user.universityId,
        universityName: user.universityName,
      },
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Failed to check authentication status' },
      { status: 500 }
    );
  }
}