// src/pages/GoatDetailPage.jsx
import React from 'react';
import { ArrowLeft, PlusCircle, Stethoscope, Heart } from 'lucide-react';

const GoatDetailPage = ({ goat, setCurrentPage, setModal }) => {

    const getStatusColor = (status) => {
        // ... (same as in GoatTracking)
    };

    return (
        <div>
            <button onClick={() => setCurrentPage('goatTracking')} className="flex items-center gap-2 text-green-400 font-bold mb-6">
                <ArrowLeft size={20} /> Back to Goat Tracking
            </button>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold font-mono text-white">{goat.goatId}</h1>
                        <p className="text-gray-400">{goat.breed} from {goat.batch}</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        {/* ... (status badge logic) */}
                    </div>
                </div>
                {/* ... (Goat stats grid) */}
            </div>

            {/* Medical Records Section */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-300">Medical History</h2>
                    <button onClick={() => setModal({ type: 'addMedicalRecord', data: goat })} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                        <Stethoscope size={20} /> Add Record
                    </button>
                </div>
                {/* ... (Table to display medical records) */}
            </div>

            {/* Breeding Records Section */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-300">Breeding History</h2>
                    <button onClick={() => setModal({ type: 'addBreedingRecord', data: goat })} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">
                        <Heart size={20} /> Add Record
                    </button>
                </div>
                {/* ... (Table to display breeding records) */}
            </div>
        </div>
    );
};

export default GoatDetailPage;