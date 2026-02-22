import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { io } from 'socket.io-client';
import {
    Users,
    BookOpen,
    CheckCircle,
    BarChart2,
    LogOut,
    Bell,
    Moon,
    Sun,
    LayoutDashboard
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const [socket, setSocket] = useState(null);
    const [stats, setStats] = useState({ present: 88, total: 48, attended: 42 });

    useEffect(() => {
        const newSocket = io();
        setSocket(newSocket);

        newSocket.on('attendanceUpdate', (data) => {
            console.log('Real-time update received:', data);
            fetchStats();
        });

        if (user) fetchStats();

        return () => newSocket.close();
    }, [user]);

    const fetchStats = async () => {
        try {
            if (user.role === 'student') {
                const res = await axios.get(`/api/attendance/student/${user.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const total = res.data.stats.length;
                const attended = res.data.stats.filter(s => s.status === 'present').length;
                setStats({
                    total,
                    attended,
                    present: total > 0 ? Math.round((attended / total) * 100) : 0
                });
            } else if (user.role === 'lecturer' || user.role === 'admin') {
                const res = await axios.get('/api/courses', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setStats(prev => ({ ...prev, courseCount: res.data.courses.length }));
            }
        } catch (err) {
            console.error('Error fetching dashboard stats', err);
        }
    };

    const AdminView = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">Admin Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/users" className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all active:scale-[0.98]">
                    <Users className="w-10 h-10 text-blue-500 mb-4" />
                    <h3 className="font-semibold text-lg dark:text-white">Manage Users</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Add or remove students and lecturers</p>
                </Link>
                <Link to="/admin/courses" className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all active:scale-[0.98]">
                    <BookOpen className="w-10 h-10 text-emerald-500 mb-4" />
                    <h3 className="font-semibold text-lg dark:text-white">Manage Courses</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure classes and assignments</p>
                </Link>
                <Link to="/admin/reports" className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all active:scale-[0.98]">
                    <BarChart2 className="w-10 h-10 text-purple-500 mb-4" />
                    <h3 className="font-semibold text-lg dark:text-white">System Reports</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View overall attendance analytics</p>
                </Link>
            </div>
        </div>
    );

    const LecturerView = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">Lecturer Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/attendance" className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-blue-900 shadow-sm bg-blue-50/50 dark:bg-blue-900/20 hover:shadow-lg transition-all active:scale-[0.98]">
                    <CheckCircle className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4" />
                    <h3 className="font-semibold text-lg dark:text-white">Take Attendance</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">Record presence for current sessions</p>
                </Link>
                <Link to="/analytics" className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all active:scale-[0.98]">
                    <BarChart2 className="w-10 h-10 text-indigo-500 mb-4" />
                    <h3 className="font-semibold text-lg dark:text-white">Class Performance</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Analyze attendance trends for your courses</p>
                </Link>
            </div>
        </div>
    );

    const StudentView = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">My Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Overall Presence</h4>
                    <div className="mt-4 flex items-end space-x-2">
                        <span className="text-4xl font-bold text-slate-900 dark:text-white">{stats.present}%</span>
                        <span className="text-emerald-500 text-sm mb-1">↑ 2%</span>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Classes Attended</h4>
                    <div className="mt-4 flex items-end space-x-2">
                        <span className="text-4xl font-bold text-slate-900 dark:text-white">{stats.attended}</span>
                        <span className="text-slate-400 dark:text-slate-500 text-sm mb-1">/ {stats.total}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 dark:bg-black text-white p-6 hidden lg:flex flex-col">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-lg text-white">A</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">Attendance</span>
                </div>

                <nav className="space-y-2 flex-1">
                    <Link to="/dashboard" className="p-3 bg-blue-600 rounded-xl flex items-center space-x-3 cursor-pointer">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link to="/analytics" className="p-3 hover:bg-slate-800 rounded-xl flex items-center space-x-3 cursor-pointer text-slate-400 hover:text-white transition-all">
                        <BarChart2 className="w-5 h-5" />
                        <span className="font-medium">Analytics</span>
                    </Link>
                </nav>

                <div className="space-y-4">
                    <button
                        onClick={toggleTheme}
                        className="w-full p-3 flex items-center justify-center space-x-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <button
                        onClick={logout}
                        className="w-full p-3 flex items-center justify-center space-x-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white capitalize">
                            Hi, {user.name}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider text-xs font-bold">
                            {user.role} Account
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </button>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border-2 border-white dark:border-slate-700 shadow-sm text-lg">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <main>
                    {user.role === 'admin' && <AdminView />}
                    {user.role === 'lecturer' && <LecturerView />}
                    {user.role === 'student' && <StudentView />}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
