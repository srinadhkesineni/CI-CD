// routes/repo.js
const express = require('express');
const Repo = require('../models/Repo');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// User adds a repo
router.post('/link', authMiddleware, async (req, res) => {
  const { repoName, repoUrl } = req.body;

  try {
    const newRepo = new Repo({
      repoName,
      repoUrl,
      user: req.user.id,
    });

    await newRepo.save();
    res.status(201).json({ message: 'Repo linked successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error linking repo' });
  }
});

module.exports = router;
