const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const { validateAttendance } = require('../middleware/validator');

// @desc    Take attendance for a course
// @route   POST /api/attendance
// @access  Private (Lecturer)
exports.takeAttendance = async (req, res, next) => {
    try {
        const { error } = validateAttendance(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const attendance = new Attendance({
            ...req.body,
            lecturer: req.user.id
        });

        await attendance.save();
        res.status(201).json({ success: true, attendance });
    } catch (err) {
        next(err);
    }
};

// @desc    Get attendance stats for a student
// @route   GET /api/attendance/student/:studentId
// @access  Private
exports.getStudentStats = async (req, res, next) => {
    try {
        const stats = await Attendance.find({ student: req.params.studentId })
            .populate('course');
        res.json({ success: true, stats });
    } catch (err) {
        next(err);
    }
};
