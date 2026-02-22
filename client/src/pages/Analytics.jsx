import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const Analytics = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([]);
    const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0 });
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        if (user) {
            if (user.role === 'student') {
                fetchStudentStats();
            } else if (user.role === 'lecturer' || user.role === 'admin') {
                fetchLecturerCourses();
            }
        }
    }, [user]);

    useEffect(() => {
        if (selectedCourse) {
            fetchCourseStats(selectedCourse._id);
        }
    }, [selectedCourse]);

    const fetchStudentStats = async () => {
        try {
            const res = await axios.get(`/api/attendance/student/${user.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const rawData = res.data.stats;
            setStats(processTrendData(rawData));
            setSummary(calculateSummary(rawData));
        } catch (err) {
            console.error('Error fetching student stats', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLecturerCourses = async () => {
        try {
            const res = await axios.get('/api/courses', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCourses(res.data.courses);
            if (res.data.courses.length > 0) {
                setSelectedCourse(res.data.courses[0]);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error('Error fetching courses', err);
            setLoading(false);
        }
    };

    const fetchCourseStats = async (courseId) => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/attendance/course/${courseId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const rawData = res.data.stats;
            setStats(processTrendData(rawData));
            setSummary(calculateSummary(rawData));
        } catch (err) {
            console.error('Error fetching course stats', err);
        } finally {
            setLoading(false);
        }
    };

    const processTrendData = (data) => {
        const grouped = {};
        data.forEach(item => {
            const date = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!grouped[date]) grouped[date] = { count: 0, present: 0 };
            grouped[date].count++;
            if (item.status === 'present') grouped[date].present++;
        });

        return Object.keys(grouped).map(date => ({
            name: date,
            rate: Math.round((grouped[date].present / grouped[date].count) * 100)
        })).slice(-10);
    };

    const calculateSummary = (data) => {
        const counts = { present: 0, absent: 0, late: 0 };
        data.forEach(item => {
            if (counts[item.status] !== undefined) counts[item.status]++;
        });
        return counts;
    };

    const pieData = [
        { name: 'Present', value: summary.present, color: '#10b981' },
        { name: 'Absent', value: summary.absent, color: '#ef4444' },
        { name: 'Late', value: summary.late, color: '#f59e0b' }
    ].filter(d => d.value > 0);

    if (loading) return <div className="min-h-[400px] flex items-center justify-center text-slate-500 animate-pulse">Loading analytics...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Class Performance</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            {user.role === 'student' ? 'Breakdown of your academic participation.' : 'Overall trends for your courses.'}
                        </p>
                    </div>
                    {(user.role === 'lecturer' || user.role === 'admin') && courses.length > 0 && (
                        <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-900 p-2 rounded-2xl">
                            {courses.map(course => (
                                <button
                                    key={course._id}
                                    onClick={() => setSelectedCourse(course)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCourse?._id === course._id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    {course.code}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: user.role === 'student' ? 'Total Sessions' : 'Total Records', value: summary.present + summary.absent + summary.late, color: 'blue' },
                    { label: 'Overall Rate', value: `${stats.length > 0 ? Math.round(stats.reduce((a, b) => a + b.rate, 0) / stats.length) : 0}%`, color: 'emerald' },
                    { label: 'Present Count', value: summary.present, color: 'indigo' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                        <div className={`text-${stat.color}-600 dark:text-${stat.color}-400 text-sm font-bold uppercase tracking-wider mb-2`}>{stat.label}</div>
                        <div className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden relative">
                    <h3 className="text-xl font-bold mb-8 text-slate-800 dark:text-white flex items-center">
                        <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
                        Attendance Trend
                    </h3>
                    <div className="h-72">
                        {stats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats}>
                                    <defs>
                                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', background: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRate)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 italic">Insufficient data to generate trend.</div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl">
                    <h3 className="text-xl font-bold mb-8 text-slate-800 dark:text-white flex items-center">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></div>
                        Status Distribution
                    </h3>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="h-64 w-full md:w-1/2">
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 italic">No status data available.</div>
                            )}
                        </div>
                        <div className="w-full md:w-1/2 space-y-4">
                            {pieData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                                    </div>
                                    <span className="font-black text-slate-900 dark:text-white">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
