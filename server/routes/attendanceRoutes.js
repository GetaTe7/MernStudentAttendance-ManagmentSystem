const express = require('express');
const router = express.Router();
const { takeAttendance, generateReport, getStudentStats, bulkTakeAttendance, getCourseStats } = require('../controllers/attendanceController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);

router.post('/bulk', authorize('lecturer'), bulkTakeAttendance);
router.post('/', authorize('lecturer'), takeAttendance);
router.get('/report/:courseId', authorize(['lecturer', 'admin']), generateReport);
router.get('/student/:studentId', getStudentStats);
router.get('/course/:courseId', authorize(['lecturer', 'admin']), getCourseStats);

module.exports = router;
