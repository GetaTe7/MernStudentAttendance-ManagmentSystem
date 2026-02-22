# Student Attendance Management System

A full-featured attendance tracking system built with the MERN stack.

## Prerequisites
- **Node.js**: Installed on your machine.
- **MongoDB**: Ensure a local instance is running on `mongodb://localhost:27017/attendance_system`.

## How to Run the Project (Simplified)

### 1. Start Both Backend & Frontend
1.  Open a terminal in the root directory (`Student-Attendance`).
2.  Run the following command:
    ```bash
    npm run dev
    ```
    This will start both the backend server (on port 5000) and the frontend (on port 5173).

### 2. Open in Browser
Copy the URL (usually `http://localhost:5173/`) and paste it into **Chrome**.

## Default Credentials (Seed Data)
To populate the database with test data, run this in the `server` directory:
```bash
node seed.js
```
Then log in with:
- **Email**: `admin@example.com`
- **Password**: `password123`
- **Role**: Admin