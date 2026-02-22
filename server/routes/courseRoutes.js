const express = require('express');
const router = express.Router();
const { createCourse, getCourses, enrollStudent, getEnrolledStudents } = require('../controllers/courseController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);

router.post('/', authorize('admin'), createCourse);
router.get('/', getCourses);
router.post('/enroll', authorize('admin'), enrollStudent);
router.get('/:courseId/students', getEnrolledStudents);

module.exports = router;
