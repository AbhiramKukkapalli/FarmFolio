import React, { useState, useMemo } from 'react';
import { Search, DollarSign, Eye } from 'lucide-react'; // Changed Pencil to Eye

const GoatTracking = ({ goats, setModal, setCurrentPage, setSelectedGoat }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Active');

    const filteredGoats = useMemo(() => {
        return goats
            .filter(goat => statusFilter === 'All' || goat.status === statusFilter)
            .filter(goat => goat.goatId.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [goats, searchTerm, statusFilter]);

    // ... getStatusColor and calculateAge functions remain the same
    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-blue-500';
            case 'Sold': return 'bg-green-500';
            case 'Died': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const calculateAge = (purchaseDate, initialAge) => {
        const monthsOnFarm = (new Date() - new Date(purchaseDate)) / (1000 * 60 * 60 * 24 * 30.44);
        return Math.floor(initialAge + monthsOnFarm);
    };


    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-green-400">Goat Tracking</h1>
                {/* ... search and filter inputs remain the same */}
            </div>

            <div className="bg-gray-800 p-2 sm:p-6 rounded-xl shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        {/* ... table head remains the same */}
                        <thead className="bg-gray-700 text-sm text-gray-300 uppercase">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Batch</th>
                                <th className="p-4">Breed</th>
                                <th className="p-4">Age (m)</th>
                                <th className="p-4">Current Wt. (kg)</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredGoats.length > 0 ? (
                                filteredGoats.map(goat => (
                                    <tr key={goat._id}>
                                        <td className="p-4 font-mono">{goat.goatId}</td>
                                        <td className="p-4">{goat.batch}</td>
                                        <td className="p-4">{goat.breed}</td>
                                        <td className="p-4">{calculateAge(goat.purchaseDate, goat.age)}</td>
                                        <td className="p-4">{goat.weightHistory.slice(-1)[0]?.weight || 'N/A'}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full text-white ${getStatusColor(goat.status)}`}>
                                                {goat.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedGoat(goat);
                                                        setCurrentPage('goatDetail');
                                                    }}
                                                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-lg flex items-center gap-1"
                                                >
                                                    <Eye size={16} /> View
                                                </button>
                                                {goat.status === 'Active' && (
                                                    <button
                                                        onClick={() => setModal({ type: 'sellGoat', data: goat })}
                                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg flex items-center gap-1"
                                                    >
                                                        <DollarSign size={16} /> Sell
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center p-8 text-gray-500">
                                        No goats found. Use the "Add Goat Purchase" action to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GoatTracking;