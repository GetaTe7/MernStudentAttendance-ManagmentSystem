const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const { validateAttendance } = require('../middleware/validator');

// @desc    Take bulk attendance for a course
// @route   POST /api/attendance/bulk
// @access  Private (Lecturer)
exports.bulkTakeAttendance = async (req, res, next) => {
    try {
        const { course, date, records } = req.body;
        // records is an array of { student, status, remarks }

        const attendanceRecords = records.map(record => ({
            course,
            date: date || new Date(),
            student: record.student,
            status: record.status,
            remarks: record.remarks || '',
            lecturer: req.user.id
        }));

        await Attendance.insertMany(attendanceRecords);

        // Emit real-time update
        const io = req.app.get('io');
        if (io) {
            io.emit('attendanceUpdate', {
                courseId: course,
                date: date || new Date(),
                totalStudents: records.length
            });
        }

        res.status(201).json({ success: true, message: 'Attendance recorded successfully' });
    } catch (err) {
        next(err);
    }
};

// @desc    Take attendance for a single student
// @route   POST /api/attendance
// @access  Private (Lecturer)
exports.takeAttendance = async (req, res, next) => {
    try {
        const { error } = validateAttendance(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { course, student, status, remarks, date } = req.body;

        const attendance = new Attendance({
            course,
            student,
            status,
            remarks,
            date: date || new Date(),
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
const fs = require('fs');

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

// @desc    Get attendance stats for a course (all students)
// @route   GET /api/attendance/course/:courseId
// @access  Private (Lecturer/Admin)
exports.getCourseStats = async (req, res, next) => {
    try {
        const stats = await Attendance.find({ course: req.params.courseId })
            .populate('student');
        res.json({ success: true, stats });
    } catch (err) {
        next(err);
    }
};
