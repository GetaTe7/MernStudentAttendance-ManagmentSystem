import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Clock, UserCheck, Briefcase } from 'lucide-react';

const Attendance = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [records, setRecords] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchStudents(selectedCourse._id);
        }
    }, [selectedCourse]);

    const fetchCourses = async () => {
        try {
            const res = await axios.get('/api/courses', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCourses(res.data.courses);
        } catch (err) {
            console.error('Error fetching courses', err);
        }
    };

    const fetchStudents = async (courseId) => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/courses/${courseId}/students`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStudents(res.data.students);
            // Initialize records with 'present' for all students
            const initialRecords = {};
            res.data.students.forEach(s => {
                initialRecords[s._id] = 'present';
            });
            setRecords(initialRecords);
        } catch (err) {
            console.error('Error fetching students', err);
        } finally {
            setLoading(false);
        }
    };

    const markAttendance = (studentId, status) => {
        setRecords({ ...records, [studentId]: status });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const attendanceData = {
                course: selectedCourse._id,
                date: new Date(),
                records: Object.keys(records).map(studentId => ({
                    student: studentId,
                    status: records[studentId]
                }))
            };

            await axios.post('/api/attendance/bulk', attendanceData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setMessage({ type: 'success', text: 'Attendance recorded successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            console.error('Error submitting attendance', err);
            setMessage({ type: 'error', text: 'Failed to record attendance.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Take Attendance</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Select a course to manage student presence.</p>
                </div>
                {selectedCourse && (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95 flex items-center space-x-2"
                    >
                        <UserCheck className="w-5 h-5" />
                        <span>{loading ? 'Submitting...' : 'Submit Records'}</span>
                    </button>
                )}
            </div>

            {message && (
                <div className={`p-4 rounded-2xl border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {courses.map(course => (
                    <button
                        key={course._id}
                        onClick={() => setSelectedCourse(course)}
                        className={`p-6 rounded-3xl border transition-all text-left group ${selectedCourse?._id === course._id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-200'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-blue-300'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${selectedCourse?._id === course._id ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                            <Briefcase className={`w-6 h-6 ${selectedCourse?._id === course._id ? 'text-white' : 'text-blue-600'}`} />
                        </div>
                        <div className="font-bold text-xl mb-1">{course.code}</div>
                        <div className={`text-sm ${selectedCourse?._id === course._id ? 'opacity-80' : 'text-slate-500'}`}>{course.title}</div>
                    </button>
                ))}
            </div>

            {selectedCourse && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                            <h3 className="font-bold text-slate-800 dark:text-white">Class List: {selectedCourse.title}</h3>
                        </div>
                        <span className="text-sm font-medium text-slate-500">{students.length} Students Enrolled</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Student Profile</th>
                                    <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Student ID</th>
                                    <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">Mark Attendance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {students.map(student => (
                                    <tr key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-slate-900 dark:text-white">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400">
                                                {student.studentId || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center space-x-3">
                                                {[
                                                    { id: 'present', color: 'emerald', icon: Check },
                                                    { id: 'late', color: 'amber', icon: Clock },
                                                    { id: 'absent', color: 'red', icon: X }
                                                ].map(status => (
                                                    <button
                                                        key={status.id}
                                                        onClick={() => markAttendance(student._id, status.id)}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${records[student._id] === status.id
                                                            ? `bg-${status.color}-500 text-white shadow-lg shadow-${status.color}-200`
                                                            : `bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-${status.color}-50 hover:text-${status.color}-600`
                                                            }`}
                                                        title={status.id.charAt(0).toUpperCase() + status.id.slice(1)}
                                                    >
                                                        <status.icon className="w-5 h-5" />
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-12 text-center text-slate-500 italic">
                                            No students enrolled in this course yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
