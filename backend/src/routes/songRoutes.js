// backend/src/routes/songRoutes.js

const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

// Define routes

// Create a new song
router.post('/', songController.createSong);

// Get all songs
router.get('/', songController.getAllSongs);

// Get a single song by ID
router.get('/:id', songController.getSongById);

// Update a song by ID
router.put('/:id', songController.updateSongById);

// Delete a song by ID
router.delete('/:id', songController.deleteSongById);

//get song statistics
router.get('/statistics', songController.getOverallStatistics);


module.exports = router;
