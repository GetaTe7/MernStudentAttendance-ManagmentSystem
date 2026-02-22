import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Clock, UserCheck } from 'lucide-react';

const Attendance = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [records, setRecords] = useState({});

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/courses', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCourses(res.data.courses);
        } catch (err) {
            console.error('Error fetching courses', err);
        }
    };

    const markAttendance = (studentId, status) => {
        setRecords({ ...records, [studentId]: status });
    };

    const handleSubmit = async () => {
        // Logic to submit multiple attendance records
        alert('Attendance submitted (Mock)');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-900">Take Attendance</h2>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-blue-200"
                >
                    Submit Records
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {courses.map(course => (
                    <button
                        key={course._id}
                        onClick={() => setSelectedCourse(course)}
                        className={`p-4 rounded-2xl border transition-all ${selectedCourse?._id === course._id
                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                                : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200'
                            }`}
                    >
                        <div className="font-bold text-lg">{course.code}</div>
                        <div className="text-sm opacity-80">{course.title}</div>
                    </button>
                ))}
            </div>

            {selectedCourse && (
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Student</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">ID</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {/* Mock student row */}
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">John Doe</td>
                                <td className="px-6 py-4 text-slate-500">STU001</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => markAttendance('STU001', 'present')}
                                            className={`p-2 rounded-lg transition-all ${records['STU001'] === 'present' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => markAttendance('STU001', 'late')}
                                            className={`p-2 rounded-lg transition-all ${records['STU001'] === 'late' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                                        >
                                            <Clock className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => markAttendance('STU001', 'absent')}
                                            className={`p-2 rounded-lg transition-all ${records['STU001'] === 'absent' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Attendance;
