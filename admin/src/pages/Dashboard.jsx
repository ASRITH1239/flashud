import React from 'react';

const Dashboard = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="h-40 border-2 border-fashion-orange/20 flex flex-col justify-center p-8">
                    <span className="text-fashion-orange text-sm font-bold mb-1 uppercase tracking-tighter">Total Revenue</span>
                    <span className="text-4xl font-bold">$124,500</span>
                </div>
                <div className="h-40 border-2 border-fashion-orange/20 flex flex-col justify-center p-8">
                    <span className="text-fashion-orange text-sm font-bold mb-1 uppercase tracking-tighter">New Orders</span>
                    <span className="text-4xl font-bold">142</span>
                </div>
                <div className="h-40 border-2 border-fashion-orange/20 flex flex-col justify-center p-8">
                    <span className="text-fashion-orange text-sm font-bold mb-1 uppercase tracking-tighter">Active Users</span>
                    <span className="text-4xl font-bold">1.2k</span>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold text-fashion-orange mb-6 uppercase tracking-widest">Recent Activity</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 border-2 border-fashion-orange/10 flex justify-between items-center">
                            <div>
                                <div className="font-bold">Order #ASH-92{i}</div>
                                <div className="text-sm opacity-50">Premium Silk Shirt - $199</div>
                            </div>
                            <div className="text-fashion-orange font-bold font-mono">COMPLETED</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
