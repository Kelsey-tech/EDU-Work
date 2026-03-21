const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never return passwordHash by default
    },
    role: {
      type: String,
      enum: ['student', 'company', 'admin'],
      default: 'student',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Student-specific profile fields
    studentProfile: {
      institution: { type: String, trim: true },
      course: { type: String, trim: true },
      graduationYear: { type: Number },
      skills: [{ type: String }],
      cvUrl: { type: String },
    },
    // Company-specific profile fields
    companyProfile: {
      companyName: { type: String, trim: true },
      industry: { type: String, trim: true },
      website: { type: String, trim: true },
      description: { type: String },
    },
  },
  {
    timestamps: true, // auto-adds createdAt and updatedAt
  }
);

// ─── Hash password before saving ──────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, SALT_ROUNDS);
  next();
});

// ─── Compare passwords ────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;