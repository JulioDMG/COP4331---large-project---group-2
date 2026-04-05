const mongoose = require('mongoose');

const GameScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: {
    type: String,
    enum: ['tictactoe', 'minesweeper', 'snake', 'sudoku', 'dinorun'],
    required: true
  },
  scoreType: {
    type: String,
    enum: ['wins', 'points', 'time', 'distance'],
    required: true
  },
  value: { type: Number, required: true }, //Total wins, best score, best time, best distance
  unit: { type: String, default: '' } // units
}, { timestamps: true }); //auto-adds createdAt & updatedAt

//one record per user per game
GameScoreSchema.index({ userId: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('GameScore', GameScoreSchema);