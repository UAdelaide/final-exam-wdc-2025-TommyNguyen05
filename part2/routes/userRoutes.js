const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login /api/users/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [[user]] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Store user info in session
    req.session.user = user;

    // indicate with dashboard to open according to user role
    res.json({ message: 'Login successful', role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST logout /api/users/logout
router.post('/logout', (req, res) => {
  // destroy the session
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    // wipe the cookie that held the session-id
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

module.exports = router;