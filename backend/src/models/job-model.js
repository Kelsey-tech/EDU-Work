const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Company reference is required'],
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote',
    },
    jobType: {
      type: String,
      enum: ['internship', 'part-time', 'full-time', 'contract'],
      required: [true, 'Job type is required'],
    },
    requirements: [
      {
        type: String,
      },
    ],
    salary: {
      type: String,
      default: 'Not specified',
    },
    applicationDeadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast searching
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ status: 1 });
jobSchema.index({ companyId: 1 });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;