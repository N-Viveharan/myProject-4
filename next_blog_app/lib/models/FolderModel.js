import mongoose from 'mongoose';

const FolderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    // Color stored as { name, hex, bg }
    color: {
      name: { type: String, default: 'indigo' },
      hex:  { type: String, default: '#4F46E5' },
      bg:   { type: String, default: 'rgba(79,70,229,0.1)' },
    },
    icon: {
      type: String,
      default: '📁',
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    starred: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Folder || mongoose.model('Folder', FolderSchema);
