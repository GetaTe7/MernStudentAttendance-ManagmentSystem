const express = require('express');
const router = express.Router();
const { takeAttendance, getStudentStats } = require('../controllers/attendanceController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);

router.post('/', authorize(['lecturer', 'admin']), takeAttendance);
router.get('/student/:studentId', getStudentStats);

module.exports = router;
