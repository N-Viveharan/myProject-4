import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import Folder from '@/lib/models/FolderModel';
import File from '@/lib/models/FileModel';
import { requireAuth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

/**
 * GET /api/folders/[id] — get a single folder with its files.
 */
export async function GET(request, { params }) {
  try {
    const { userId, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    await connectDB();

    const folder = await Folder.findOne({ _id: id, owner: userId }).lean();
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const files = await File.find({ folderId: id, owner: userId }).lean().sort({ createdAt: -1 });

    return NextResponse.json({
      folder: {
        id:          folder._id.toString(),
        name:        folder.name,
        description: folder.description,
        color:       folder.color,
        icon:        folder.icon,
        isPrivate:   folder.isPrivate,
        starred:     folder.starred,
        createdAt:   folder.createdAt,
        updatedAt:   folder.updatedAt,
        files: files.map((f) => ({
          id:         f._id.toString(),
          name:       f.name,
          size:       f.size,
          uploadedAt: f.createdAt,
          starred:    f.starred,
        })),
      },
    });
  } catch (err) {
    console.error('GET /api/folders/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/folders/[id] — update folder fields (name, starred, isPrivate, description).
 */
export async function PATCH(request, { params }) {
  try {
    const { userId, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const body   = await request.json();

    const allowed = ['name', 'description', 'starred', 'isPrivate', 'color', 'icon'];
    const updates = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }
    if (updates.name) updates.name = updates.name.trim();

    await connectDB();

    const folder = await Folder.findOneAndUpdate(
      { _id: id, owner: userId },
      { $set: updates },
      { new: true }
    );
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const files = await File.find({ folderId: id, owner: userId }).lean().sort({ createdAt: -1 });

    return NextResponse.json({
      folder: {
        id:          folder._id.toString(),
        name:        folder.name,
        description: folder.description,
        color:       folder.color,
        icon:        folder.icon,
        isPrivate:   folder.isPrivate,
        starred:     folder.starred,
        createdAt:   folder.createdAt,
        updatedAt:   folder.updatedAt,
        files: files.map((f) => ({
          id:         f._id.toString(),
          name:       f.name,
          size:       f.size,
          uploadedAt: f.createdAt,
          starred:    f.starred,
        })),
      },
    });
  } catch (err) {
    console.error('PATCH /api/folders/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/folders/[id] — delete folder and all its files (from DB + disk).
 */
export async function DELETE(request, { params }) {
  try {
    const { userId, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    await connectDB();

    const folder = await Folder.findOne({ _id: id, owner: userId });
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Delete files from disk
    const files = await File.find({ folderId: id, owner: userId });
    for (const file of files) {
      const filePath = path.join(process.cwd(), 'public', file.storagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete file records and folder from DB
    await File.deleteMany({ folderId: id, owner: userId });
    await Folder.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Folder deleted' });
  } catch (err) {
    console.error('DELETE /api/folders/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
