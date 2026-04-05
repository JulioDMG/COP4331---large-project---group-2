// routes/scores.js
const express = require('express');
const router = express.Router();
const GameScore = require('../models/GameScore');

const authMiddleware = require('../middleware/authMiddleware').protect;

const GAME_CONFIG = {
  tictactoe:   { type: 'wins',      logic: 'increment', unit: 'wins' },
  minesweeper: { type: 'wins',      logic: 'increment', unit: 'wins' },
  snake:       { type: 'points',    logic: 'max',       unit: 'pts' },
  sudoku:      { type: 'time',      logic: 'min',       unit: 'ms' },
  dinorun:     { type: 'distance',  logic: 'max',       unit: 'm' }
};

// POST /api/scores
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { game, value } = req.body;
    const config = GAME_CONFIG[game];
    
    if (!config || typeof value !== 'number' || value < 0) {
      return res.status(400).json({ error: 'Invalid game or score value' });
    }

    let scoreDoc = await GameScore.findOne({ userId: req.user.id, game });

    if (!scoreDoc) {
      scoreDoc = new GameScore({
        userId: req.user.id,
        game,
        scoreType: config.type,
        value,
        unit: config.unit
      });
    } else {
      if (config.logic === 'increment') {
        scoreDoc.value += value;
      } else if (config.logic === 'max') {
        if (value > scoreDoc.value) scoreDoc.value = value;
      } else if (config.logic === 'min') {
        if (value < scoreDoc.value) scoreDoc.value = value;
      }
    }

    await scoreDoc.save();
    res.json({ message: 'Score updated', data: scoreDoc });
  } catch (err) {
    console.error('[Scores API] Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/scores/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const scores = await GameScore.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(scores);
  } catch (err) {
    console.error('[Scores API] Error fetching scores:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/scores/leaderboard/:game
router.get('/leaderboard/:game', async (req, res) => {
  try {
    const { game } = req.params;
    const config = GAME_CONFIG[game];
    if (!config) return res.status(400).json({ error: 'Invalid game' });

    const sortOrder = config.logic === 'min' ? 1 : -1;
    
    const leaderboard = await GameScore.find({ game })
      .sort({ value: sortOrder })
      .limit(10)
      .populate('userId', 'username')
      .select('game value unit updatedAt');
      
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
