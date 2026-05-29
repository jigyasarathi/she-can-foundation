const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true, lowercase: true },
    phone:     { type: String, trim: true },
    college:   { type: String, required: true, trim: true },
    skills:    { type: String, required: true, trim: true },
    linkedIn:  { type: String, trim: true },
    resumePath:{ type: String },
    areaOfInterest: {
      type: String,
      required: true,
      enum: [
        'Full Stack Development',
        'AI / Machine Learning',
        'UI/UX Design',
        'Digital Marketing & Outreach',
        'Content Writing',
        'Campus Ambassador',
        'Fundraising',
        'Other',
      ],
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    message:  { type: String, trim: true },
    // AI-derived category
    category: {
      type: String,
      enum: ['Full Stack', 'AI Engineer', 'UI/UX', 'Outreach', 'General'],
      default: 'General',
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
      default: 'Pending',
    },
    applicationId: { type: String, unique: true },
    interviewDate: { type: String, trim: true },
    interviewTime: { type: String, trim: true },
    meetingLink: { type: String, trim: true },
    joiningInstructions: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
