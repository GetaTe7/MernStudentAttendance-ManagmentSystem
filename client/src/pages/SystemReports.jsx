import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Users, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';

const SystemReports = () => {
    const [reportData, setReportData] = useState({ stats: [], distributions: [], totals: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSystemStats();
    }, []);

    const fetchSystemStats = async () => {
        try {
            const res = await axios.get('/api/courses', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const totalCourses = res.data.courses.length;

            // For a real app, this would be a dedicated admin stats endpoint
            // Here we'll aggregate some data for the demo
            setReportData({
                stats: [
                    { name: 'Mon', attendance: 85 },
                    { name: 'Tue', attendance: 88 },
                    { name: 'Wed', attendance: 92 },
                    { name: 'Thu', attendance: 89 },
                    { name: 'Fri', attendance: 91 },
                ],
                distributions: [
                    { name: 'Computer Science', value: 45, color: '#3b82f6' },
                    { name: 'Information Tech', value: 30, color: '#10b981' },
                    { name: 'Software Engineering', value: 25, color: '#6366f1' },
                ],
                totals: {
                    courses: totalCourses,
                    students: 1240, // Mock for demo
                    lecturers: 42,   // Mock for demo
                    presence: '89%'
                }
            });
        } catch (err) {
            console.error('Error fetching system reports', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse text-slate-500">Generating system reports...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h2 className="text-3xl font-bold dark:text-white">System Analytics</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Aggregated attendance and participation across all departments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Students', value: reportData.totals.students, icon: Users, color: 'blue' },
                    { label: 'Active Courses', value: reportData.totals.courses, icon: BookOpen, color: 'emerald' },
                    { label: 'Avg Presence', value: reportData.totals.presence, icon: CheckCircle, color: 'indigo' },
                    { label: 'Lecturers', value: reportData.totals.lecturers, icon: TrendingUp, color: 'purple' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className={`p-3 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-2xl w-fit mb-4`}>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">{stat.label}</div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl">
                    <h3 className="text-xl font-bold mb-8 dark:text-white">Attendance Trends (System-Wide)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={reportData.stats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', background: '#fff' }} />
                                <Area type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={4} fill="#3b82f6" fillOpacity={0.1} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl">
                    <h3 className="text-xl font-bold mb-8 dark:text-white">Department Participation</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData.distributions}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '20px', border: 'none' }} />
                                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                    {reportData.distributions.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemReports;
