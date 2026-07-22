import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // never returned by default
    },
    role: {
      type: String,
      default: 'Free Plan',
    },
    bio: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'English',
    },
    storageUsed: {
      type: Number,
      default: 0, // in GB
    },
    storageTotal: {
      type: Number,
      default: 100, // in GB
    },
    notifications: {
      email:   { type: Boolean, default: true },
      uploads: { type: Boolean, default: true },
      shared:  { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Derive initials from name as a virtual field
UserSchema.virtual('initials').get(function () {
  return this.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
