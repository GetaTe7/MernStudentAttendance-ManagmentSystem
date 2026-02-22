const Course = require('../models/Course');
const Department = require('../models/Department');
const Enrollment = require('../models/Enrollment');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin)
exports.createCourse = async (req, res, next) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json({ success: true, course });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().populate('department lecturer');
        res.json({ success: true, courses });
    } catch (err) {
        next(err);
    }
};

// @desc    Enroll a student in a course
// @route   POST /api/courses/enroll
// @access  Private (Admin)
exports.enrollStudent = async (req, res, next) => {
    try {
        const { student, course } = req.body;
        const enrollment = new Enrollment({ student, course });
        await enrollment.save();
        res.status(201).json({ success: true, enrollment });
    } catch (err) {
        next(err);
    }
};
// @desc    Get students enrolled in a course
// @route   GET /api/courses/:courseId/students
// @access  Private (Lecturer/Admin)
exports.getEnrolledStudents = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ course: req.params.courseId }).populate('student');
        const students = enrollments.map(e => e.student);
        res.json({ success: true, students });
    } catch (err) {
        next(err);
    }
};
