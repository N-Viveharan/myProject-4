import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import File from '@/lib/models/FileModel';
import { requireAuth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

/**
 * GET /api/files/[id]/download — stream a file back to the client.
 */
export async function GET(request, { params }) {
  try {
    const { userId, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    await connectDB();

    const file = await File.findOne({ _id: id, owner: userId });
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), 'public', file.storagePath);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found on disk' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="${encodeURIComponent(file.name)}"`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error('GET /api/files/[id]/download error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
