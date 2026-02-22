import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, BookOpen, MoreVertical, Trash2, Edit } from 'lucide-react';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await axios.get('/api/courses', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCourses(res.data.courses);
        } catch (err) {
            console.error('Error fetching courses', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center animate-pulse text-slate-500">Loading course registry...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div>
                    <h2 className="text-3xl font-bold dark:text-white">Course Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Configure and assign courses to lecturers.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Add New Course</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by code or title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase text-xs font-black tracking-widest border-b border-slate-100 dark:border-slate-700">
                                <th className="px-8 py-5">Course Details</th>
                                <th className="px-8 py-5">Lecturer</th>
                                <th className="px-8 py-5">Credits</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                            {filteredCourses.map((course) => (
                                <tr key={course._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                {course.code.substring(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{course.title}</div>
                                                <div className="text-slate-500 text-xs mt-0.5">{course.code} • {course.semester} {course.year}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold dark:text-white">
                                                {course.lecturer?.name?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-slate-600 dark:text-slate-300 font-medium">{course.lecturer?.name || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold">
                                            {course.credits} Credits
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="text-slate-400 hover:text-blue-600 transition-colors p-2">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button className="text-slate-400 hover:text-red-500 transition-colors p-2">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CourseManagement;
