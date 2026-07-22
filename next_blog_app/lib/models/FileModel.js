import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    size: {
      type: Number,
      required: true, // in bytes
    },
    storagePath: {
      type: String,
      required: true, // path relative to /public, e.g. "uploads/filename.pdf"
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    starred: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.File || mongoose.model('File', FileSchema);
