const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getCourseSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  completeSession,
  getUserProgress
} = require('../controllers/sessionController');

// Get all sessions for a course
router.get('/course/:courseId', getCourseSessions);

// Get user progress for a course
router.get('/progress/:courseId', authMiddleware, getUserProgress);

// Get single session
router.get('/:id', getSessionById);

// Create new session
router.post('/', authMiddleware, createSession);

// Update session
router.put('/:id', authMiddleware, updateSession);

// Delete session
router.delete('/:id', authMiddleware, deleteSession);

// Mark session as completed
router.post('/:id/complete', authMiddleware, completeSession);

module.exports = router;