const express = require('express');
const router = express.Router();
const Melody = require('../models/Melody');

// Get all melodies
router.get('/', async (req, res) => {
  try {
    const melodies = await Melody.find().sort({ createdAt: -1 });
    res.json(melodies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new melody
router.post('/', async (req, res) => {
  const melody = new Melody({
    title: req.body.title,
    notes: req.body.notes
  });

  try {
    const newMelody = await melody.save();
    res.status(201).json(newMelody);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get melody by ID
router.get('/:id', async (req, res) => {
  try {
    const melody = await Melody.findById(req.params.id);
    if (!melody) return res.status(404).json({ message: 'Melody not found' });
    res.json(melody);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;