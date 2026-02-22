const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['present', 'absent', 'late'],
        default: 'present'
    },
    remarks: { type: String },
    location: { // For future GPS verification
        lat: Number,
        lng: Number
    }
}, { timestamps: true });

// Ensure a student can only have one attendance record per course per day
attendanceSchema.index({ course: 1, student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
