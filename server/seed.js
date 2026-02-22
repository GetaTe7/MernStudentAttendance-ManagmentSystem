const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
const Course = require('./models/Course');
const fs = require('fs');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Department.deleteMany({});
        await Course.deleteMany({});

        // Create Department
        const dept = await Department.create({
            name: 'Computer Science',
            code: 'CS',
            description: 'Department of Computer Science'
        });

        // Create Admin
        console.log('Creating Admin User...');
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
            department: dept._id
        }).catch(err => {
            console.error('Failed to create Admin:', err);
            throw err;
        });

        // Create Lecturer
        const lecturer = await User.create({
            name: 'Dr. Smith',
            email: 'lecturer@example.com',
            password: 'password123',
            role: 'lecturer',
            department: dept._id
        });

        // Create Student
        const student = await User.create({
            name: 'John Doe',
            email: 'student@example.com',
            password: 'password123',
            role: 'student',
            department: dept._id,
            studentId: 'STU001'
        });

        // Create Course
        const course = await Course.create({
            title: 'Web Development',
            code: 'CS101',
            credits: 3,
            department: dept._id,
            lecturer: lecturer._id,
            semester: 'Fall',
            year: 2026
        });

        console.log('Database seeded successfully!');
        process.exit();
    } catch (err) {
        fs.writeFileSync('seed_error.log', err.stack || err.toString());
        console.error('Error seeding database:', err.stack || err);
        process.exit(1);
    }
};

seedData();
