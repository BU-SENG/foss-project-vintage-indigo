const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getUserGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  toggleGoalCompletion
} = require('../controllers/goalController');

// All routes require authentication
router.use(authMiddleware);

// Get all user goals
router.get('/', getUserGoals);

// Get single goal
router.get('/:id', getGoalById);

// Create new goal
router.post('/', createGoal);

// Update goal
router.put('/:id', updateGoal);

// Delete goal
router.delete('/:id', deleteGoal);

// Toggle goal completion
router.patch('/:id/toggle', toggleGoalCompletion);

module.exports = router;