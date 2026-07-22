import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import File from '@/lib/models/FileModel';
import User from '@/lib/models/UserModel';
import { requireAuth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

/**
 * PATCH /api/files/[id] — rename or star/unstar a file.
 * Body: { name?, starred? }
 */
export async function PATCH(request, { params }) {
  try {
    const { userId, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const body   = await request.json();

    const allowed = ['name', 'starred'];
    const updates = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }
    if (updates.name) updates.name = updates.name.trim();

    await connectDB();

    const file = await File.findOneAndUpdate(
      { _id: id, owner: userId },
      { $set: updates },
      { new: true }
    );
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({
      file: {
        id:         file._id.toString(),
        name:       file.name,
        size:       file.size,
        uploadedAt: file.createdAt,
        starred:    file.starred,
      },
    });
  } catch (err) {
    console.error('PATCH /api/files/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/files/[id] — delete a file from DB and disk.
 */
export async function DELETE(request, { params }) {
  try {
    const { userId, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    await connectDB();

    const file = await File.findOne({ _id: id, owner: userId });
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Remove from disk
    const filePath = path.join(process.cwd(), 'public', file.storagePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Free storage usage
    const gbFreed = file.size / (1024 * 1024 * 1024);
    await User.findByIdAndUpdate(userId, { $inc: { storageUsed: -gbFreed } });

    await File.findByIdAndDelete(id);

    return NextResponse.json({ message: 'File deleted' });
  } catch (err) {
    console.error('DELETE /api/files/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
