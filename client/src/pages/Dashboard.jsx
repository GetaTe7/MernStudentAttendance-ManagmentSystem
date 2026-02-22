import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Users,
    BookOpen,
    CheckCircle,
    BarChart2,
    LogOut,
    Bell
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();

    const AdminView = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admin Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <Users className="w-10 h-10 text-blue-500 mb-4" />
                    <h3 className="font-semibold text-lg">Manage Users</h3>
                    <p className="text-slate-500 text-sm mt-1">Add or remove students and lecturers</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <BookOpen className="w-10 h-10 text-emerald-500 mb-4" />
                    <h3 className="font-semibold text-lg">Manage Courses</h3>
                    <p className="text-slate-500 text-sm mt-1">Configure classes and assignments</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <BarChart2 className="w-10 h-10 text-purple-500 mb-4" />
                    <h3 className="font-semibold text-lg">System Reports</h3>
                    <p className="text-slate-500 text-sm mt-1">View overall attendance analytics</p>
                </div>
            </div>
        </div>
    );

    const LecturerView = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Lecturer Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-blue-100 shadow-sm bg-blue-50/50">
                    <CheckCircle className="w-10 h-10 text-blue-600 mb-4" />
                    <h3 className="font-semibold text-lg">Take Attendance</h3>
                    <p className="text-slate-600 text-sm mt-1">Record presence for current sessions</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <BarChart2 className="w-10 h-10 text-indigo-500 mb-4" />
                    <h3 className="font-semibold text-lg">Class Performance</h3>
                    <p className="text-slate-500 text-sm mt-1">Analyze attendance trends for your courses</p>
                </div>
            </div>
        </div>
    );

    const StudentView = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <h4 className="text-slate-500 text-sm font-medium">Overall Presence</h4>
                    <div className="mt-4 flex items-end space-x-2">
                        <span className="text-4xl font-bold text-slate-900">88%</span>
                        <span className="text-emerald-500 text-sm mb-1">↑ 2%</span>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <h4 className="text-slate-500 text-sm font-medium">Classes Attended</h4>
                    <div className="mt-4 flex items-end space-x-2">
                        <span className="text-4xl font-bold text-slate-900">42</span>
                        <span className="text-slate-400 text-sm mb-1">/ 48</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar Placeholder */}
            <div className="w-64 bg-slate-900 text-white p-6 hidden lg:block">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-lg">A</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">Attendance</span>
                </div>

                <nav className="space-y-2">
                    <div className="p-3 bg-blue-600 rounded-xl flex items-center space-x-3 cursor-pointer">
                        <BarChart2 className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </div>
                    {/* Add more nav items here */}
                </nav>

                <div className="absolute bottom-10 left-6 right-6">
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
                        <h1 className="text-3xl font-extrabold text-slate-900 capitalize">
                            Hi, {user.name}
                        </h1>
                        <p className="text-slate-500 mt-1 uppercase tracking-wider text-xs font-bold">
                            {user.role} Account
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-3 bg-white border border-slate-100 rounded-full shadow-sm hover:bg-slate-50 transition-all">
                            <Bell className="w-5 h-5 text-slate-600" />
                        </button>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
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
