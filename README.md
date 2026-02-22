# Student Attendance Management System

A full-featured attendance tracking system built with the MERN stack, featuring role-based access control, real-time updates, and comprehensive analytics.

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   # In root, client, and server directories
   npm install
   ```

2. **Setup Database**:
   - Ensure MongoDB is running on `mongodb://localhost:27017/attendance_system`.
   - Seed the data for testing:
     ```bash
     cd server
     node seed.js
     ```

3. **Run the App**:
   - From the root directory:
     ```bash
     npm run dev
     ```
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Default Credentials (Seed Data)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` |
| **Lecturer** | `lecturer@example.com` | `password123` |
| **Student** | `student@example.com` | `password123` |

---

## 📖 Step-by-Step Usage Guide

### 🛡️ Admin (System Management)
1. **Login**: Use the Admin credentials.
2. **User Registry**: Click **Manage Users** to view all registered students and lecturers. You can search by name or email.
3. **Course Management**: Click **Manage Courses** to see the list of classes and assigned lecturers.
4. **System Reports**: Click **System Reports** to see global attendance trends and participation charts across departments.

### 🎓 Lecturer (Class Management)
1. **Login**: Use the Lecturer credentials.
2. **Record Attendance**: 
   - Choose **Take Attendance** from the dashboard.
   - Select a course (e.g., **Web Development**).
   - You will see the list of enrolled students.
   - Mark students as **Present**, **Absent**, or **Late** and click **Submit**.
3. **Analyze Trends**: Use the **Class Performance** section to view attendance trends and charts for your classes.

### 👤 Student (Personal Tracking)
1. **Login**: Use the Student credentials.
2. **Overview**: View your **Overall Presence** percentage directly on the dashboard.
3. **Detailed Analytics**: Navigate to the **Analytics** page to see a pie chart breakdown of your attendance (Present vs. Absent).

---

## 🛠️ Features
- **Real-time Analytics**: Charts powered by Recharts for instant data visualization.
- **Dynamic UI**: Responsive design with Dark/Light mode support.
- **Security**: JWT authentication and role-based route protection.
- **Real-time Updates**: Socket.io integration for instant dashboard refreshes.