// backend/src/controllers/songController.js

const Song = require('../models/Song');

// Controller functions

// Create a new song
exports.createSong = async (req, res) => {
  try {
    const { title, artist, album, genre } = req.body;
    const newSong = new Song({ title, artist, album, genre });
    const savedSong = await newSong.save();
    res.status(201).json(savedSong);
  } catch (error) {
    console.error('Error creating song:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all songs
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    console.error('Error getting all songs:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single song by ID
exports.getSongById = async (req, res) => {
  const { id } = req.params;
  try {
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    console.error('Error getting song by ID:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a song by ID
exports.updateSongById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedSong = await Song.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSong) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(updatedSong);
  } catch (error) {
    console.error('Error updating song by ID:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a song by ID
exports.deleteSongById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSong = await Song.findByIdAndDelete(id);
    if (!deletedSong) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(deletedSong);
  } catch (error) {
    console.error('Error deleting song by ID:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get overall statistics
exports.getOverallStatistics = async (req, res) => {
  try {
    const totalSongs = await Song.countDocuments();
    const totalArtists = await Song.distinct('artist').countDocuments();
    const totalAlbums = await Song.distinct('album').countDocuments();
    const totalGenres = await Song.distinct('genre').countDocuments();

    const genresCount = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
    ]);

    const artistsAndAlbumsCount = await Song.aggregate([
      { $group: { _id: { artist: '$artist', album: '$album' }, count: { $sum: 1 } } },
    ]);

    const statistics = {
      totalSongs,
      totalArtists,
      totalAlbums,
      totalGenres,
      genresCount,
      artistsAndAlbumsCount,
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error getting overall statistics:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};