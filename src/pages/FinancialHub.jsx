// src/pages/FinancialHub.jsx
import React from 'react';
import MetricCard from '../components/MetricCard';
import { DollarSign, BarChart2 } from 'lucide-react';

const FinancialHub = ({ expenses, income, goats }) => {
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    const totalLivestockCost = expenses
        .filter(e => e.category === 'Livestock Purchase')
        .reduce((sum, item) => sum + item.amount, 0);

    const allTransactions = [...expenses.map(e => ({ ...e, type: 'expense' })), ...income.map(i => ({ ...i, type: 'income' }))]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div>
            <h1 className="text-3xl font-bold text-green-400 mb-6">Financial Hub</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard title="Total Revenue" value={`₹${totalIncome.toLocaleString('en-IN')}`} icon={<DollarSign className="text-green-400" />} />
                <MetricCard title="Total Expenses" value={`₹${totalExpenses.toLocaleString('en-IN')}`} icon={<DollarSign className="text-red-400" />} />
                <MetricCard title="Net Profit / Loss" value={`₹${netProfit.toLocaleString('en-IN')}`} icon={<BarChart2 className={netProfit >= 0 ? 'text-green-400' : 'text-red-400'} />} />
                <MetricCard title="Total Livestock Cost" value={`₹${totalLivestockCost.toLocaleString('en-IN')}`} icon={<DollarSign className="text-blue-400" />} />
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700 text-sm text-gray-300 uppercase">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Category</th>
                                <th className="p-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {allTransactions.slice(0, 15).map((t) => (
                                <tr key={t.id}>
                                    <td className="p-4 whitespace-nowrap">{t.date}</td>
                                    <td className="p-4">{t.description}</td>
                                    <td className="p-4">{t.category || 'Livestock Sale'}</td>
                                    <td className={`p-4 text-right font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                        {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default FinancialHub;

