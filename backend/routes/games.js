const express = require('express');
const router = express.Router();
const { getGames, getGameById, createGame, updateGame, deleteGame } = require('../controllers/gameController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getGames);
router.get('/:id', getGameById);
router.post('/', protect, adminOnly, upload.array('images', 5), createGame);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateGame);
router.delete('/:id', protect, adminOnly, deleteGame);

module.exports = router;
