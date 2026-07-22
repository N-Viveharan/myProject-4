import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import File from '@/lib/models/FileModel';
import Folder from '@/lib/models/FolderModel';
import User from '@/lib/models/UserModel';
import { requireAuth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

/**
 * POST /api/files — upload one or more files to a folder.
 * Expects multipart/form-data with fields:
 *   - folderId (string)
 *   - files[]  (File blobs)
 */
export async function POST(request) {
  try {
    const { userId, error } = await requireAuth();
    if (error) return error;

    const formData = await request.formData();
    const folderId = formData.get('folderId');

    if (!folderId) {
      return NextResponse.json({ error: 'folderId is required.' }, { status: 400 });
    }

    await connectDB();

    // Verify folder ownership
    const folder = await Folder.findOne({ _id: folderId, owner: userId });
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found.' }, { status: 404 });
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const rawFiles = formData.getAll('files');
    if (!rawFiles.length) {
      return NextResponse.json({ error: 'No files provided.' }, { status: 400 });
    }

    const savedFiles = [];
    let totalNewBytes = 0;

    for (const rawFile of rawFiles) {
      if (typeof rawFile === 'string') continue; // skip non-file fields

      const bytes     = await rawFile.arrayBuffer();
      const buffer    = Buffer.from(bytes);
      const timestamp = Date.now();
      const safeName  = rawFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename  = `${timestamp}_${safeName}`;
      const filePath  = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);

      const fileDoc = await File.create({
        name:        rawFile.name,
        size:        rawFile.size,
        storagePath: `uploads/${filename}`,
        folderId,
        owner:       userId,
      });

      savedFiles.push({
        id:         fileDoc._id.toString(),
        name:       fileDoc.name,
        size:       fileDoc.size,
        uploadedAt: fileDoc.createdAt,
        starred:    fileDoc.starred,
      });

      totalNewBytes += rawFile.size;
    }

    // Update folder's updatedAt
    await Folder.findByIdAndUpdate(folderId, { updatedAt: new Date() });

    // Update user's storageUsed (convert bytes → GB)
    const gbUsed = totalNewBytes / (1024 * 1024 * 1024);
    await User.findByIdAndUpdate(userId, { $inc: { storageUsed: gbUsed } });

    return NextResponse.json({ files: savedFiles }, { status: 201 });
  } catch (err) {
    console.error('POST /api/files error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
