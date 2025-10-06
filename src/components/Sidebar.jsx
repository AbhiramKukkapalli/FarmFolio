import React from 'react';
import { LogOut, BookHeart, X } from 'lucide-react'; // Changed from MountainSnow

const Sidebar = ({ navItems, currentPage, setCurrentPage, onLogout, isOpen, setIsOpen }) => {
    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-800 p-6 flex flex-col justify-between shadow-xl z-40 transform transition-transform md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div>
                    <div className="flex items-center justify-between gap-3 mb-10">
                        <div className="flex items-center gap-3">
                            <BookHeart className="text-green-400" size={32} />
                            <h1 className="text-2xl font-bold text-white tracking-wider">FarmFolio</h1>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    <nav>
                        <ul>
                            {navItems.map(item => (
                                <li key={item.id} className="mb-2">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentPage(item.id);
                                        }}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${currentPage === item.id
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        <span className="font-semibold">{item.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-semibold">Logout</span>
                </button>
            </aside>
        </>
    );
};

export default Sidebar;