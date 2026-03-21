const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, 'First name is required'], trim: true },
    lastName: { type: String, required: [true, 'Last name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['student', 'company', 'admin'], default: 'student' },
    isActive: { type: Boolean, default: true },
    studentProfile: {
      institution: { type: String, trim: true },
      course: { type: String, trim: true },
      graduationYear: { type: Number },
      skills: [{ type: String }],
      cvUrl: { type: String },
    },
    companyProfile: {
      companyName: { type: String, trim: true },
      industry: { type: String, trim: true },
      website: { type: String, trim: true },
      description: { type: String },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, SALT_ROUNDS);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
module.exports = User;