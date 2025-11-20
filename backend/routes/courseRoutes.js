const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getUserCourses
} = require('../controllers/courseController');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post('/', authMiddleware, createCourse);
router.put('/:id', authMiddleware, updateCourse);
router.delete('/:id', authMiddleware, deleteCourse);

// Enrollment routes
router.post('/:id/enroll', authMiddleware, enrollCourse);
router.get('/user/enrolled', authMiddleware, getUserCourses);

module.exports = router;