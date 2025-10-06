// src/pages/AnalyticsDashboard.jsx
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const AnalyticsDashboard = ({ goats, batches, feedLog }) => {
    // Handle cases where there might be no batches initially
    const [selectedBatchName, setSelectedBatchName] = useState(Object.keys(batches).length > 0 ? Object.keys(batches)[0] : null);

    const batchOptions = Object.keys(batches).map(b => ({ value: b, label: b }));

    // --- Chart Data Calculations ---

    const batchWeightData = useMemo(() => {
        // Add a guard clause to prevent errors if no batch is selected or found
        if (!selectedBatchName || !batches[selectedBatchName]) return [];

        const batchGoats = goats.filter(g => g.batch === selectedBatchName);
        const batchStartDate = new Date(batches[selectedBatchName].startDate);

        const dailyAverages = {}; // { 0: { total: 20, count: 1}, 30: { total: 25, count: 1}}

        batchGoats.forEach(goat => {
            goat.weightHistory.forEach(record => {
                const daysSinceStart = Math.round((new Date(record.date) - batchStartDate) / (1000 * 60 * 60 * 24));
                if (daysSinceStart >= 0) {
                    if (!dailyAverages[daysSinceStart]) {
                        dailyAverages[daysSinceStart] = { total: 0, count: 0 };
                    }
                    dailyAverages[daysSinceStart].total += record.weight;
                    dailyAverages[daysSinceStart].count++;
                }
            });
        });

        return Object.keys(dailyAverages)
            .map(day => ({
                day: parseInt(day),
                avgWeight: parseFloat((dailyAverages[day].total / dailyAverages[day].count).toFixed(2)),
            }))
            .sort((a, b) => a.day - b.day);

    }, [goats, batches, selectedBatchName]);

    const growthByFeedTypeData = useMemo(() => {
        const feedStats = {}; // { 'TMR Mix': { totalADG: 0, count: 0 } }

        const goatADG = goats.reduce((acc, goat) => {
            if (goat.status === 'Active' && goat.weightHistory.length > 1) {
                const currentWeight = goat.weightHistory.slice(-1)[0].weight;
                const daysOnFarm = (new Date() - new Date(goat.purchaseDate)) / (1000 * 60 * 60 * 24);
                if (daysOnFarm > 0) {
                    acc[goat.id] = (currentWeight - goat.purchaseWeight) / daysOnFarm; // kg per day
                }
            }
            return acc;
        }, {});

        feedLog.forEach(log => {
            if (!feedStats[log.feedName]) {
                feedStats[log.feedName] = { totalADG: 0, count: 0 };
            }
            const targetGoats = log.target === 'all' ? goats.filter(g => g.status === 'Active') : goats.filter(g => g.batch === log.target && g.status === 'Active');
            targetGoats.forEach(goat => {
                if (goatADG[goat.id]) {
                    feedStats[log.feedName].totalADG += goatADG[goat.id];
                    feedStats[log.feedName].count++;
                }
            });
        });

        return Object.keys(feedStats).map(name => ({
            name,
            // avgDailyGain in grams
            avgDailyGain: feedStats[name].count > 0 ? (feedStats[name].totalADG / feedStats[name].count) * 1000 : 0
        }));

    }, [goats, feedLog]);


    const statusDistribution = useMemo(() => {
        const counts = goats.reduce((acc, goat) => {
            acc[goat.status] = (acc[goat.status] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(counts).map(name => ({ name, value: counts[name] }));
    }, [goats]);

    const breedDistribution = useMemo(() => {
        const counts = goats.reduce((acc, goat) => {
            acc[goat.breed] = (acc[goat.breed] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(counts).map(name => ({ name, value: counts[name] }));
    }, [goats]);

    const COLORS = {
        'Active': '#3b82f6', 'Sold': '#22c55e', 'Died': '#ef4444',
        'Boer': '#8b5cf6', 'Sirohi': '#f97316', 'Jamunapari': '#14b8a6',
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-green-400 mb-8">Analytics Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Batch-wise Weight Growth Chart */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-300">Batch-wise Avg. Weight Growth</h2>
                        <select
                            value={selectedBatchName || ''}
                            onChange={(e) => setSelectedBatchName(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded p-2"
                            disabled={batchOptions.length === 0}
                        >
                            {batchOptions.length > 0
                                ? batchOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)
                                : <option>No Batches Available</option>
                            }
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={batchWeightData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="day" stroke="#a0aec0" label={{ value: 'Days Since Batch Start', position: 'insideBottom', offset: -15, fill: '#a0aec0' }} />
                            <YAxis stroke="#a0aec0" label={{ value: 'kg', angle: -90, position: 'insideLeft', fill: '#a0aec0' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }} />
                            <Legend verticalAlign="top" />
                            <Line type="monotone" dataKey="avgWeight" name="Avg. Weight" stroke="#38a169" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Growth based on Feed Type */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-300 mb-4">Avg. Daily Gain by Feed Type</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={growthByFeedTypeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="name" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" label={{ value: 'g / day', angle: -90, position: 'insideLeft', fill: '#a0aec0' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }} formatter={(value) => `${value.toFixed(1)} g/day`} />
                            <Bar dataKey="avgDailyGain" name="Avg. Daily Gain" fill="#8b5cf6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Distribution Pie Chart */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-300 mb-4">Herd Status Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {statusDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Breed Distribution Pie Chart */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-300 mb-4">Herd Breed Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={breedDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} label>
                                {breedDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#a0aec0'} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;

