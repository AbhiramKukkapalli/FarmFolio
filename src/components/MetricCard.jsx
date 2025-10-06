// src/components/MetricCard.jsx
import React from 'react';

const MetricCard = ({ title, value, icon }) => {
    return (
        <div className="bg-gray-800 p-5 rounded-xl shadow-lg flex items-center justify-between transition-transform transform hover:scale-105">
            <div>
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
            <div className="text-3xl">
                {icon}
            </div>
        </div>
    );
};

export default MetricCard;

