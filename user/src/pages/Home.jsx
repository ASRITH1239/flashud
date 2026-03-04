import React from 'react';

const Home = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-16">
                <div className="h-[60vh] border-2 border-fashion-orange flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 flex items-center justify-center text-[20rem] font-black select-none pointer-events-none">
                        STYLE
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter italic">SPRING '26</h1>
                    <p className="text-lg md:text-xl font-medium tracking-widest mb-8 opacity-70 uppercase">Defining the new formal</p>
                    <button className="px-12 py-4 border-2 border-fashion-orange bg-fashion-orange text-fashion-black font-black hover:bg-transparent hover:text-fashion-orange transition-all tracking-widest uppercase">
                        Explore Collection
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="group">
                        <div className="aspect-[3/4] border-2 border-fashion-orange/10 mb-4 flex items-center justify-center grayscale group-hover:grayscale-0 group-hover:border-fashion-orange transition-all duration-500">
                            <div className="text-fashion-orange/20 font-bold text-xs uppercase tracking-widest">IMAGE_{i}</div>
                        </div>
                        <div className="font-bold uppercase tracking-wider mb-1 text-sm">Essential Piece {i}</div>
                        <div className="text-fashion-orange font-mono text-xs italic">$249.00</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
