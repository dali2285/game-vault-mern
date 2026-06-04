const express = require('express');
const router = express.Router();
const { getGames, getGameById, createGame, updateGame, deleteGame } = require('../controllers/gameController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getGames);
router.get('/:id', getGameById);
router.post('/', protect, adminOnly, createGame);
router.put('/:id', protect, adminOnly, updateGame);
router.delete('/:id', protect, adminOnly, deleteGame);

module.exports = router;
