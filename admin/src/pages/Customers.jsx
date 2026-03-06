import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setIsLoading(true);
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setCustomers(data);
        setIsLoading(false);
    };

    const filteredCustomers = customers.filter(c =>
        c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto selection:bg-brand-orange selection:text-white pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-3xl font-light text-white tracking-[0.2em] relative inline-block">
                        CLIENT <span className="font-bold text-brand-orange drop-shadow-[0_0_8px_rgba(255,123,0,0.4)]">DIRECTORY</span>
                    </h2>
                    <div className="h-px w-24 bg-gradient-to-r from-brand-orange to-transparent mt-4"></div>
                </div>

                <div className="relative w-full md:w-96 mt-6 md:mt-0">
                    <input
                        type="text"
                        placeholder="SEARCH BY NAME OR EMAIL..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-5 py-3.5 rounded-full bg-black/20 border border-white/10 text-white font-medium tracking-wide focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-white/30 shadow-inner"
                    />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 text-sm">🔍</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {isLoading ? (
                    <div className="col-span-full p-20 text-center font-medium uppercase tracking-[0.2em] text-white/50">Accessing Profile Vault...</div>
                ) : filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                    <div key={customer.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,123,0,0.1)] transition-all duration-300 group">
                        <div className="w-20 h-20 shrink-0 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center font-bold text-3xl text-brand-orange shadow-inner group-hover:shadow-[0_0_20px_rgba(255,123,0,0.2)] transition-shadow">
                            {customer.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 w-full">
                            <div className="text-xl sm:text-2xl font-medium text-white uppercase tracking-wider leading-none mb-2 group-hover:text-brand-orange transition-colors">
                                {customer.full_name || 'ANONYMOUS UNIT'}
                            </div>
                            <div className="text-xs font-medium text-white/50 uppercase tracking-[0.1em] mb-4 truncate">
                                {customer.email || 'NO EMAIL LINKED'}
                            </div>

                            <div className="flex gap-6 border-t border-white/10 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-1">LOYALTY STATUS</span>
                                    <span className="text-[10px] sm:text-xs font-bold text-brand-orange uppercase">PREMIUM MEMBER</span>
                                </div>
                                <div className="w-px h-8 bg-white/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-1">JOINED CYCLE</span>
                                    <span className="text-[10px] sm:text-xs font-medium text-white uppercase tracking-[0.1em]">{new Date(customer.created_at).getFullYear()}</span>
                                </div>
                            </div>
                        </div>
                        <button className="hidden sm:flex w-12 h-12 shrink-0 rounded-full border border-white/10 items-center justify-center font-bold text-white/50 hover:text-brand-orange hover:bg-white/10 hover:border-brand-orange/30 transition-all group-hover:translate-x-1">
                            →
                        </button>
                    </div>
                )) : (
                    <div className="col-span-full p-20 text-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                        <div className="font-medium text-white/40 uppercase tracking-[0.2em]">NO MATCHING PERSONNEL FOUND</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Customers;

