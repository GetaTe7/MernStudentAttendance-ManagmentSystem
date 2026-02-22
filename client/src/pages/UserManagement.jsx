import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Search, Shield, GraduationCap, Briefcase, Mail, Filter } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            // Updated to fetch real data from backend
            const res = await axios.get('/api/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Fallback to mock if API is not yet fully implemented or empty
            if (res.data.users && res.data.users.length > 0) {
                setUsers(res.data.users);
            } else {
                setUsers([
                    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
                    { id: 2, name: 'Dr. Smith', email: 'lecturer@example.com', role: 'lecturer' },
                    { id: 3, name: 'John Doe', email: 'student@example.com', role: 'student', studentId: 'STU001' },
                    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'student', studentId: 'STU002' },
                    { id: 5, name: 'Prof. Davis', email: 'davis@example.com', role: 'lecturer' },
                ]);
            }
        } catch (err) {
            console.error('Error fetching users', err);
            // Partial fallback for demonstration
            setUsers([
                { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
                { id: 2, name: 'Dr. Smith', email: 'lecturer@example.com', role: 'lecturer' },
                { id: 3, name: 'John Doe', email: 'student@example.com', role: 'student', studentId: 'STU001' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterRole === 'all' || u.role === filterRole)
    );

    if (loading) return <div className="p-8 text-center animate-pulse text-slate-500">Retrieving user records...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div>
                    <h2 className="text-3xl font-bold dark:text-white">User Registry</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage global system access and role assignments.</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Onboard User</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <Filter className="w-5 h-5 text-slate-400" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 outline-none"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admins Only</option>
                            <option value="lecturer">Lecturers Only</option>
                            <option value="student">Students Only</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase text-xs font-black tracking-widest border-b border-slate-100 dark:border-slate-700">
                                <th className="px-8 py-5">User Account</th>
                                <th className="px-8 py-5">Role</th>
                                <th className="px-8 py-5">Access Level</th>
                                <th className="px-8 py-5 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                            {filteredUsers.map((u) => (
                                <tr key={u.id || u._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-600 dark:text-white uppercase">
                                                {u.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                                                <div className="text-slate-500 text-xs flex items-center">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center">
                                            {u.role === 'admin' && <Shield className="w-4 h-4 text-purple-500 mr-2" />}
                                            {u.role === 'lecturer' && <Briefcase className="w-4 h-4 text-blue-500 mr-2" />}
                                            {u.role === 'student' && <GraduationCap className="w-4 h-4 text-emerald-500 mr-2" />}
                                            <span className="capitalize text-slate-700 dark:text-slate-300 font-bold text-sm">{u.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="h-2 w-32 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${u.role === 'admin' ? 'bg-purple-500 w-full' : u.role === 'lecturer' ? 'bg-blue-500 w-2/3' : 'bg-emerald-500 w-1/3'}`}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            Active
                                        </span>
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

export default UserManagement;
