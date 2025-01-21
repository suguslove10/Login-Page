import express from 'express';
import jwt from 'jsonwebtoken';
import Vendor from '../models/Vendor.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, storeName } = req.body;

    // Check if vendor already exists
    let vendor = await Vendor.findOne({ email });
    if (vendor) {
      return res.status(400).json({ message: 'A vendor with this email already exists' });
    }

    // Validate input
    if (!email || !password || !storeName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (storeName.length < 2) {
      return res.status(400).json({ message: 'Store name must be at least 2 characters long' });
    }

    // Create new vendor
    vendor = new Vendor({
      email,
      password,
      storeName
    });

    await vendor.save();

    // Create JWT token
    const token = jwt.sign(
      { id: vendor._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      vendor: {
        id: vendor._id,
        email: vendor.email,
        storeName: vendor.storeName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages[0] });
    }
    
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find vendor by email
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await vendor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: vendor._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      vendor: {
        id: vendor._id,
        email: vendor.email,
        storeName: vendor.storeName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;