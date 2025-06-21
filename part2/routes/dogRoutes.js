const express = require('express');
const db = require('../models/db');
const router = express.Router();

// Task 17:
// GET /api/dogs that does not require the user to be logged in
router.get('/', async (req, res) => {
  try {
    const [dogs] = await db.query(
      `SELECT dog_id, name, size, owner_id FROM Dogs`
    );
    res.json(dogs);
  } catch (err) {
    console.error('SQL error in GET /api/dogs:', err);
    res.status(500).json({ error: 'Could not load dogs' });
  }
});

// Task 15:
// GET /api/my-dogs
router.get('/my-dogs', async (req, res) => {
    // Require the user to be logged in first
    if (!req.session.user) return res.sendStatus(401);
    try {
        // Get the owner_id from the session
        const owner_id = req.session.user.user_id;
        // Get all dogs from the owner_id
        const [dogs] = await db.query(
        `SELECT dog_id, name FROM Dogs WHERE owner_id = ?`, [owner_id]
        );
    // Return the list of dogs
    res.json(dogs);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).json({ error: 'Could not load dogs', details: error.message });
    }
});

module.exports = router;