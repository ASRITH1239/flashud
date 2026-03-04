import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminManagement = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setIsAnimating(true);
        loadAdmins();
    }, []);

    const loadAdmins = () => {
        const storedAdmins = JSON.parse(localStorage.getItem('adminUsers') || '[]');
        const defaultAdmin = { 
            id: 'default', 
            name: 'Default Admin', 
            email: 'admin@flashud.com', 
            password: 'admin123',
            createdAt: new Date('2024-01-01').toISOString(),
            isDefault: true
        };
        setAdmins([defaultAdmin, ...storedAdmins]);
    };

    const handleDeleteAdmin = (adminId) => {
        if (adminId === 'default') {
            alert('Cannot delete the default admin account');
            return;
        }

        const storedAdmins = JSON.parse(localStorage.getItem('adminUsers') || '[]');
        const updatedAdmins = storedAdmins.filter(admin => admin.id !== adminId);
        localStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));
        loadAdmins();
        setShowDeleteConfirm(null);
    };

    const filteredAdmins = admins.filter(admin => 
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header with Animation */}
            <div className={`mb-8 transition-all duration-1000 transform ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-3xl font-bold text-fashion-orange uppercase tracking-widest mb-2">Admin Management</h1>
                <p className="text-gray-400">Manage admin accounts and permissions</p>
            </div>

            {/* Search and Actions */}
            <div className={`mb-8 flex flex-col sm:flex-row gap-4 transition-all duration-1000 transform ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                 style={{ transitionDelay: '200ms' }}>
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search admins by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white placeholder-gray-500"
                    />
                </div>
                <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-2 bg-fashion-orange text-fashion-black font-bold border-2 border-fashion-orange hover:bg-transparent hover:text-fashion-orange transition-all"
                >
                    Add New Admin
                </button>
            </div>

            {/* Admins Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdmins.map((admin, index) => (
                    <div key={admin.id || index} 
                         className={`border-2 border-fashion-orange/20 p-6 relative overflow-hidden transition-all duration-700 transform hover:scale-105 hover:border-fashion-orange/40 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                         style={{ transitionDelay: `${400 + index * 100}ms` }}>
                        
                        {/* Background Animation */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-fashion-orange rounded-full filter blur-2xl opacity-10 animate-pulse"></div>
                        
                        {/* Admin Info */}
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-fashion-orange rounded-full flex items-center justify-center text-fashion-black font-bold text-lg">
                                    {admin.name.charAt(0).toUpperCase()}
                                </div>
                                {admin.isDefault && (
                                    <span className="px-2 py-1 bg-fashion-orange/20 text-fashion-orange text-xs font-bold rounded">
                                        DEFAULT
                                    </span>
                                )}
                            </div>
                            
                            <h3 className="font-bold text-lg mb-1">{admin.name}</h3>
                            <p className="text-gray-400 text-sm mb-2">{admin.email}</p>
                            <p className="text-gray-500 text-xs mb-4">
                                Created: {formatDate(admin.createdAt)}
                            </p>
                            
                            {/* Actions */}
                            <div className="flex gap-2">
                                <button className="flex-1 px-3 py-1 bg-fashion-orange/20 text-fashion-orange text-sm font-bold rounded hover:bg-fashion-orange/30 transition-colors">
                                    Edit
                                </button>
                                {!admin.isDefault && (
                                    <button 
                                        onClick={() => setShowDeleteConfirm(admin.id)}
                                        className="flex-1 px-3 py-1 bg-red-500/20 text-red-500 text-sm font-bold rounded hover:bg-red-500/30 transition-colors"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Delete Confirmation */}
                        {showDeleteConfirm === admin.id && (
                            <div className="absolute inset-0 bg-fashion-black/90 flex items-center justify-center z-20">
                                <div className="text-center p-4">
                                    <p className="text-white mb-4">Delete {admin.name}?</p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleDeleteAdmin(admin.id)}
                                            className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded hover:bg-red-600"
                                        >
                                            Yes
                                        </button>
                                        <button 
                                            onClick={() => setShowDeleteConfirm(null)}
                                            className="px-3 py-1 bg-gray-600 text-white text-sm font-bold rounded hover:bg-gray-700"
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredAdmins.length === 0 && (
                <div className={`text-center py-12 transition-all duration-1000 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                     style={{ transitionDelay: '600ms' }}>
                    <div className="text-gray-400 mb-4">
                        <div className="text-6xl mb-4">👥</div>
                        <p className="text-xl">No admins found</p>
                        <p className="text-sm mt-2">Try adjusting your search or add a new admin</p>
                    </div>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-6 py-2 bg-fashion-orange text-fashion-black font-bold border-2 border-fashion-orange hover:bg-transparent hover:text-fashion-orange transition-all"
                    >
                        Add First Admin
                    </button>
                </div>
            )}

            {/* Stats Summary */}
            <div className={`mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all duration-1000 transform ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                 style={{ transitionDelay: '800ms' }}>
                <div className="border-2 border-fashion-orange/20 p-4 text-center">
                    <div className="text-2xl font-bold text-fashion-orange">{admins.length}</div>
                    <div className="text-sm text-gray-400">Total Admins</div>
                </div>
                <div className="border-2 border-fashion-orange/20 p-4 text-center">
                    <div className="text-2xl font-bold text-fashion-orange">{admins.filter(a => !a.isDefault).length}</div>
                    <div className="text-sm text-gray-400">Custom Admins</div>
                </div>
                <div className="border-2 border-fashion-orange/20 p-4 text-center">
                    <div className="text-2xl font-bold text-fashion-orange">1</div>
                    <div className="text-sm text-gray-400">Default Admin</div>
                </div>
            </div>
        </div>
    );
};

export default AdminManagement;
