# API Documentation - Student Attendance Management System

## Base URL
`http://localhost:5000/api`

## Authentication
All routes except login/register require a `Bearer <token>` in the `Authorization` header.

### 1. Auth Routes
- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Login and receive JWT.
- **GET /auth/me**: Get current user profile.

### 2. Course Routes
- **POST /courses**: Create a new course (Admin only).
- **GET /courses**: List all courses.
- **POST /courses/enroll**: Enroll a student in a course (Admin only).

### 3. Attendance Routes
- **POST /attendance**: Record attendance (Lecturer/Admin).
- **GET /attendance/student/:studentId**: Get attendance statistics for a student.
- **GET /attendance/report/:courseId?format=pdf**: Download attendance report (PDF/CSV).

## Real-time Updates
The system uses Socket.io to broadcast attendance updates.
- **Event**: `attendanceUpdate`
- **Data**: Updated attendance object.
