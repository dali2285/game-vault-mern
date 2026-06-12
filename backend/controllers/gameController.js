const Game = require('../models/Game');

// @desc    Get all games (with search, filter, sort)
// @route   GET /api/games
const getGames = async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 12 } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    let sortOption = {};
    if (sort === 'price_asc') sortOption = { price: 1, _id: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1, _id: -1 };
    else if (sort === 'rating') sortOption = { rating: -1, _id: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1, _id: -1 };
    else sortOption = { createdAt: -1, _id: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Game.countDocuments(query);
    const games = await Game.find(query).sort(sortOption).skip(skip).limit(Number(limit));

    res.json({ games, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error('[v0] getGames error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single game
// @route   GET /api/games/:id
const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate('reviews.user', 'name');
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (err) {
    console.error('[v0] getGameById error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create game (admin)
// @route   POST /api/games
const createGame = async (req, res) => {
  try {
    const { title, description, price, category, imageUrls } = req.body;
    
    // Combine uploaded files and image URLs
    let images = [];
    
    // Add uploaded file paths
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    // Add provided URLs
    if (imageUrls) {
      const urlArray = typeof imageUrls === 'string' 
        ? imageUrls.split(',').map(url => url.trim()).filter(Boolean)
        : Array.isArray(imageUrls) ? imageUrls : [];
      images = [...images, ...urlArray];
    }
    
    const game = await Game.create({ 
      title, 
      description, 
      price, 
      category, 
      images: images.length > 0 ? images : [] 
    });
    res.status(201).json(game);
  } catch (err) {
    console.error('[v0] createGame error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update game (admin)
// @route   PUT /api/games/:id
const updateGame = async (req, res) => {
  try {
    const { imageUrls } = req.body;
    let updateData = { ...req.body };
    delete updateData.imageUrls;
    
    // Get existing game to preserve images if needed
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    
    // Handle images
    let images = game.images || [];
    
    // If new files uploaded, replace/add to images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      // Replace existing images or add new ones
      images = newImages.length > 0 ? newImages : images;
    }
    
    // Add image URLs if provided
    if (imageUrls) {
      const urlArray = typeof imageUrls === 'string' 
        ? imageUrls.split(',').map(url => url.trim()).filter(Boolean)
        : Array.isArray(imageUrls) ? imageUrls : [];
      if (urlArray.length > 0) {
        images = req.files && req.files.length > 0 
          ? [...images, ...urlArray] 
          : urlArray;
      }
    }
    
    updateData.images = images;
    
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json(updatedGame);
  } catch (err) {
    console.error('[v0] updateGame error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete game (admin)
// @route   DELETE /api/games/:id
const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json({ message: 'Game removed' });
  } catch (err) {
    console.error('[v0] deleteGame error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getGames, getGameById, createGame, updateGame, deleteGame };
