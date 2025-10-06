// src/pages/Dashboard.jsx

import React from 'react';
import MetricCard from '../components/MetricCard';
import { ChevronsRight, DollarSign, PlusCircle, Droplet, BarChart2 } from 'lucide-react';

const Dashboard = ({ goats, batches, expenses, income, setModal }) => {
    const activeGoats = goats.filter(g => g.status === 'Active').length;
    const totalSold = goats.filter(g => g.status === 'Sold').length;
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div>
            <h1 className="text-3xl font-bold text-green-400 mb-6 hidden md:block">Farm Dashboard</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <MetricCard title="Active Goats" value={activeGoats} icon={<ChevronsRight className="text-blue-400" />} />
                <MetricCard title="Total Sold" value={totalSold} icon={<DollarSign className="text-green-400" />} />
                <MetricCard title="Total Expenses" value={`₹${totalExpenses.toLocaleString('en-IN')}`} icon={<div className="text-red-400 text-2xl font-bold">→</div>} />
                <MetricCard title="Total Revenue" value={`₹${totalIncome.toLocaleString('en-IN')}`} icon={<div className="text-green-400 text-2xl font-bold">←</div>} />
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-300">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => setModal({ type: 'addPurchase' })} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"><PlusCircle size={20} /> Add Goat Purchase</button>
                    <button onClick={() => setModal({ type: 'logFeed' })} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"><Droplet size={20} /> Log a Feeding</button>
                    <button onClick={() => setModal({ type: 'recordWeight' })} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"><BarChart2 size={20} /> Record Goat Weight</button>
                    <button onClick={() => setModal({ type: 'addExpense' })} className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"><DollarSign size={20} /> Add New Expense</button>
                </div>
            </div>

            <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Batch Progress</h2>
                <div className="space-y-4">
                    {Object.keys(batches).length > 0 ? Object.keys(batches).map(batchName => {
                        const batchGoats = goats.filter(g => g.batch === batchName);
                        if (batchGoats.length === 0) return null;
                        const activeInBatch = batchGoats.filter(g => g.status === 'Active').length;
                        const avgPurchaseWeight = batchGoats.reduce((sum, goat) => sum + goat.purchaseWeight, 0) / batchGoats.length || 0;
                        const currentWeights = batchGoats.map(goat => goat.weightHistory.slice(-1)[0]?.weight).filter(w => w != null);
                        const avgCurrentWeight = currentWeights.reduce((sum, weight) => sum + weight, 0) / currentWeights.length || 0;
                        return (
                            <div key={batchName} className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-green-400">{batchName}</h3>
                                    <span className="text-sm text-gray-400">{activeInBatch} / {batchGoats.length} Active</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1">Avg. Purchase Wt: <span className="font-semibold">{avgPurchaseWeight.toFixed(2)} kg</span></p>
                                <p className="text-sm text-gray-300">Avg. Current Wt: <span className="font-semibold">{avgCurrentWeight.toFixed(2)} kg</span></p>
                            </div>
                        );
                    }) : <p className="text-center text-gray-500 py-4">No batches created yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;