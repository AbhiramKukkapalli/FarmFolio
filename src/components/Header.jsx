// src/components/Header.jsx

import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ toggleSidebar, currentPageLabel }) => {
    return (
        <header className="md:hidden bg-gray-800 p-4 shadow-md flex items-center gap-4">
            <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
                <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-white">{currentPageLabel}</h1>
        </header>
    );
};

export default Header;