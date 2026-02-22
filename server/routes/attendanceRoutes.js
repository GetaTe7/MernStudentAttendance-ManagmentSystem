const express = require('express');
const router = express.Router();
const { takeAttendance, getStudentStats, generateReport } = require('../controllers/attendanceController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);

router.post('/', authorize(['lecturer', 'admin']), takeAttendance);
router.get('/report/:courseId', authorize(['lecturer', 'admin']), generateReport);
router.get('/student/:studentId', getStudentStats);

module.exports = router;
