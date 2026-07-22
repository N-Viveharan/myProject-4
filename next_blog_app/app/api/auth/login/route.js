import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/models/UserModel';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch user with password (select: false by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Issue JWT cookie
    const token = signToken(user._id.toString());
    await setAuthCookie(token);

    return NextResponse.json({
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
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
