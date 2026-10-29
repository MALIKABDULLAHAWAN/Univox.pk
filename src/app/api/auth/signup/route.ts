import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  universityId: z.string().cuid('Invalid university ID'),
  studentIdHash: z.string().min(1, 'Student ID is required'),
  agreeToTerms: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = signUpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, universityId, studentIdHash } = validation.data;
    const normalizedEmail = email.toLowerCase();

    // Check if email already exists in Student
    const existingStudent = await prisma.student.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Email already registered. Please sign in.' },
        { status: 409 }
      );
    }

    // Check if student ID hash already exists
    const existingStudentId = await prisma.student.findUnique({
      where: { studentIdHash },
    });

    if (existingStudentId) {
      return NextResponse.json(
        { error: 'Student ID already registered.' },
        { status: 409 }
      );
    }

    // Verify university exists
    const university = await prisma.university.findUnique({
      where: { id: universityId },
    });

    if (!university) {
      return NextResponse.json(
        { error: 'Invalid university selected.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create student first
    const student = await prisma.student.create({
      data: {
        email: normalizedEmail,
        universityId,
        studentIdHash,
        verificationStatus: 'pending',
      },
    });

    // Create User record for NextAuth
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: university.name,
      },
    });

    // Create Password record
    await prisma.password.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: 'Account created successfully. Please check your email to verify your account.',
        userId: student.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration.' },
      { status: 500 }
    );
  }
}