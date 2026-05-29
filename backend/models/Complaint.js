const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    citizenName: {
      type: String,
      required: [true, 'Citizen name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    aadhaarNumber: {
      type: String,
      required: [true, 'Aadhaar number is required'],
      match: [/^\d{12}$/, 'Aadhaar number must be exactly 12 digits'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Age must be at least 1'],
      max: [120, 'Age must be at most 120'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      minlength: [10, 'Address must be at least 10 characters'],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'],
    },
    issueStatement: {
      type: String,
      required: [true, 'Issue statement is required'],
      trim: true,
      minlength: [20, 'Issue statement must be at least 20 characters'],
    },
    issuePhoto: {
      type: String,
      default: null,
    },
    dateOfIssue: {
      type: Date,
      required: [true, 'Date of issue is required'],
    },
    authority: {
      type: String,
      required: [true, 'Authority is required'],
      enum: {
        values: ['Collector', 'MLA', 'Counsellor'],
        message: 'Authority must be Collector, MLA, or Counsellor',
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    adminNote: {
      type: String,
      default: '',
      trim: true,
    },
    citizenEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
