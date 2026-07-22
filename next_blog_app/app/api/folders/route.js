import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import Folder from '@/lib/models/FolderModel';
import File from '@/lib/models/FileModel';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/folders — list all folders for the authenticated user,
 * with a `files` array and computed stats.
 */
export async function GET() {
  try {
    const { userId, error } = await requireAuth();
    if (error) return error;

    await connectDB();

    const folders = await Folder.find({ owner: userId }).lean().sort({ updatedAt: -1 });
    const files   = await File.find({ owner: userId }).lean();

    // Attach files to their folder
    const filesByFolder = {};
    for (const file of files) {
      const key = file.folderId.toString();
      if (!filesByFolder[key]) filesByFolder[key] = [];
      filesByFolder[key].push({
        id:         file._id.toString(),
        name:       file.name,
        size:       file.size,
        uploadedAt: file.createdAt,
        starred:    file.starred,
      });
    }

    const result = folders.map((f) => ({
      id:          f._id.toString(),
      name:        f.name,
      description: f.description,
      color:       f.color,
      icon:        f.icon,
      isPrivate:   f.isPrivate,
      starred:     f.starred,
      createdAt:   f.createdAt,
      updatedAt:   f.updatedAt,
      files:       filesByFolder[f._id.toString()] || [],
    }));

    return NextResponse.json({ folders: result });
  } catch (err) {
    console.error('GET /api/folders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/folders — create a new folder.
 * Body: { name, description?, colorName?, icon?, isPrivate? }
 */
export async function POST(request) {
  try {
    const { userId, error } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const { name, description, color, icon, isPrivate } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Folder name is required.' }, { status: 400 });
    }

    await connectDB();

    const folder = await Folder.create({
      name: name.trim(),
      description: description?.trim() || '',
      color: color || { name: 'indigo', hex: '#4F46E5', bg: 'rgba(79,70,229,0.1)' },
      icon: icon || '📁',
      isPrivate: isPrivate || false,
      owner: userId,
    });

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
        files:       [],
      },
    }, { status: 201 });
  } catch (err) {
    console.error('POST /api/folders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
