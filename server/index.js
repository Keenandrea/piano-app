const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const melodiesRoutes = require('./routes/melodies');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/piano-app';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Routes
app.use('/api/melodies', melodiesRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Piano App API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});