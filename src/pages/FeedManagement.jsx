// src/pages/FeedManagement.jsx
import React from 'react';
import { Wheat, PlusCircle } from 'lucide-react';

const FeedManagement = ({ feedInventory, feedLog, setModal }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-green-400">Feed & Inventory</h1>
                <button
                    onClick={() => setModal({ type: 'addFeedStock' })}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
                >
                    <PlusCircle size={20} /> Add New Feed Stock
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedInventory.map(item => (
                    <div key={item.id} className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="bg-blue-500 p-3 rounded-full">
                                <Wheat className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{item.name}</h2>
                            </div>
                        </div>
                        <p className="text-3xl font-light text-gray-200">
                            <span className="font-bold">{item.quantity.toFixed(1)}</span> {item.unit}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">in stock</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Recent Feed Log</h2>
                {feedLog.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-700 text-sm text-gray-300 uppercase">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Feed</th>
                                    <th className="p-4">Target</th>
                                    <th className="p-4 text-right">Quantity (kg)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {feedLog.slice(0, 10).map(log => (
                                    <tr key={log.id}>
                                        <td className="p-4">{log.date}</td>
                                        <td className="p-4">{log.feedName}</td>
                                        <td className="p-4 capitalize">{log.target}</td>
                                        <td className="p-4 text-right">{log.quantity} kg</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">
                        No feeding history recorded yet. Use "Quick Actions" to log a feeding.
                    </p>
                )}
            </div>
        </div>
    );
};

export default FeedManagement;

