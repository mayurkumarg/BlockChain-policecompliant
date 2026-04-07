const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const Complaint = require('../models/Complaint');
const { protect, authorize } = require('../middleware/authMiddleware');
// const { contract } = require('../config/blockchain');
// const ipfs = require('../config/ipfs'); // Disabled

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Submit complaint
router.post('/submit', protect, authorize('CITIZEN'), async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { name, title, description, location, date } = req.body;

    if (!name || !title || !description || !location || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const crypto = require('crypto');
    const id = crypto.randomUUID();

    const parsedDate = new Date(date);

    const complaint = new Complaint({
      id,
      name,
      title,
      description,
      location,
      date: parsedDate,
      evidence: null,
      status: "Pending",
      blockchainHash: "dummy_" + Date.now(),
      ipfsHash: null
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint
    });

  } catch (error) {
    console.error("🔥 REAL ERROR:", error);
    res.status(500).json({ error: error.message }); // ✅ IMPORTANT
  }
});

// Get all complaints
router.get('/', protect, authorize('POLICE', 'ADMIN'), async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Get complaint by ID
router.get('/:id', protect, authorize('POLICE', 'ADMIN'), async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complaint' });
  }
});

// Update complaint status
router.put('/:id/status', protect, authorize('POLICE', 'ADMIN'), async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`[DEBUG] Update attempt for ${req.params.id} to '${status}' by user: ${req.user.email} (Role: ${req.user.role})`);
    
    const complaint = await Complaint.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true }
    );
    if (!complaint) {
        console.log(`[DEBUG] Complaint not found: ${req.params.id}`);
        return res.status(404).json({ error: 'Complaint not found' });
    }

    console.log(`[DEBUG] Success updating ${req.params.id} to ${status}`);
    res.json(complaint);
  } catch (error) {
    console.error(`[DEBUG] Update error:`, error.message);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;