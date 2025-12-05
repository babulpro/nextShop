import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';


// POST - Create new session (Login)
export async function POST(request) {
  try {
    const body = await request.json();
    const userId = body.userId;
    const rememberMe = body.rememberMe || false;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create session token
    const sessionToken = randomBytes(32).toString('hex');
    
    // Set expiry date
    const expires = new Date();
    expires.setDate(expires.getDate() + (rememberMe ? 30 : 1));

    // Save session to database
    const session = await prisma.session.create({
      data: {
        sessionToken,
        expires,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'nextshop-session',
      value: sessionToken,
      expires: expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({
      session: {
        id: session.id,
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
        user: session.user,
      },
    });
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
