import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/models/UserModel';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const { userId, error } = await requireAuth();
    if (error) return error;

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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
    console.error('Me error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { userId, error } = await requireAuth();
    if (error) return error;

    const updates = await request.json();
    // Only allow safe fields to be updated
    const allowed = ['name', 'bio', 'language', 'notifications'];
    const filtered = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) filtered[key] = updates[key];
    }
    if (filtered.name) {
      filtered.name = filtered.name.trim();
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(userId, { $set: filtered }, { new: true });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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
    console.error('Update user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
