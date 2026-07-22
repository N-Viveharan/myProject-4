import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/models/UserModel';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate inputs
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required.' },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
    });

    // Issue JWT cookie
    const token = signToken(user._id.toString());
    await setAuthCookie(token);

    return NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          initials: user.initials,
          storageUsed: user.storageUsed,
          storageTotal: user.storageTotal,
          bio: user.bio,
          language: user.language,
          notifications: user.notifications,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
