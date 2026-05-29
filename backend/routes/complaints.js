const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Complaint = require('../models/Complaint');
const { protect, adminOnly } = require('../middleware/auth');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/complaints - Create complaint (citizen)
router.post('/', protect, upload.single('issuePhoto'), async (req, res) => {
  try {
    const {
      citizenName, aadhaarNumber, age, address,
      mobileNumber, issueStatement, dateOfIssue, authority, citizenEmail,
    } = req.body;

    const complaintData = {
      citizenName, aadhaarNumber, age: Number(age),
      address, mobileNumber, issueStatement, dateOfIssue, authority,
      citizenEmail: citizenEmail || '',
      issuePhoto: req.file ? req.file.filename : null,
      submittedBy: req.user.role === 'citizen' ? req.user._id : null,
    };

    const complaint = new Complaint(complaintData);
    await complaint.save();

    res.status(201).json({ success: true, message: 'Complaint submitted successfully', data: complaint });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// GET /api/complaints - Get all complaints (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, authority, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (authority) filter.authority = authority;
    if (search) {
      filter.$or = [
        { citizenName: { $regex: search, $options: 'i' } },
        { aadhaarNumber: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
      ];
    }
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// GET /api/complaints/my - Get my complaints (citizen)
router.get('/my', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ mobileNumber: req.user.mobile }).sort({ createdAt: -1 });
    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// GET /api/complaints/stats/summary - Stats (admin only)
router.get('/stats/summary', protect, adminOnly, async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const rejected = await Complaint.countDocuments({ status: 'Rejected' });
    res.json({ success: true, data: { total, pending, inProgress, resolved, rejected } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// GET /api/complaints/:id - Get single complaint
router.get('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    // Citizens can only view their own complaints
    if (req.user.role === 'citizen' && complaint.mobileNumber !== req.user.mobile) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// PUT /api/complaints/:id - Update complaint (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const allowed = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const update = {};
    if (status) update.status = status;
    if (adminNote !== undefined) update.adminNote = adminNote;

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, message: 'Complaint updated', data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// DELETE /api/complaints/:id - Delete complaint (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    if (complaint.issuePhoto) {
      const filePath = path.join(__dirname, '../uploads', complaint.issuePhoto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Complaint deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

module.exports = router;
