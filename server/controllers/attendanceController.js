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

const { generateAttendancePDF } = require('../utils/pdfGenerator');
const { generateAttendanceCSV } = require('../utils/csvGenerator');
const path = require('path');

// @desc    Generate and download attendance report (PDF/CSV)
// @route   GET /api/attendance/report/:courseId
// @access  Private (Lecturer/Admin)
exports.generateReport = async (req, res, next) => {
    try {
        const { format } = req.query; // 'pdf' or 'csv'
        const { courseId } = req.params;

        const course = await Course.findById(courseId).populate('lecturer');
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const records = await Attendance.find({ course: courseId }).populate('student');

        const metadata = {
            courseName: course.title,
            courseCode: course.code,
            lecturerName: course.lecturer.name
        };

        let filePath;
        if (format === 'csv') {
            filePath = await generateAttendanceCSV(records, metadata);
        } else {
            filePath = await generateAttendancePDF(records, metadata);
        }

        res.download(filePath, (err) => {
            if (err) next(err);
            // Optional: Delete file after download
            // fs.unlinkSync(filePath);
        });
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
