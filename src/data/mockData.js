// src/data/mockData.js

// Helper function to generate a date offset from today
const daysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
};

export const initialGoats = [
    {
        id: 'G-001',
        age: 5, // months
        breed: 'Boer',
        batch: 'Batch A - Summer',
        status: 'Active',
        purchaseDate: daysAgo(60),
        purchaseCost: 8500,
        purchaseWeight: 15, // kg
        healthLog: [{ date: daysAgo(55), note: 'Initial checkup, all clear.' }, { date: daysAgo(30), note: 'Deworming administered.' }],
        dailyFeed: [{ date: daysAgo(60), feed: 'TMR Mix', quantity: 1.5 }, { date: daysAgo(30), feed: 'Silage Plus', quantity: 2.0 }],
        weightHistory: [
            { date: daysAgo(60), weight: 15 },
            { date: daysAgo(30), weight: 22 },
            { date: daysAgo(0), weight: 28 }
        ],
        soldFor: null,
    },
    {
        id: 'G-002',
        age: 6,
        breed: 'Sirohi',
        batch: 'Batch A - Summer',
        status: 'Active',
        purchaseDate: daysAgo(60),
        purchaseCost: 7800,
        purchaseWeight: 14,
        healthLog: [{ date: daysAgo(55), note: 'Initial checkup, healthy.' }],
        dailyFeed: [{ date: daysAgo(60), feed: 'TMR Mix', quantity: 1.5 }],
        weightHistory: [
            { date: daysAgo(60), weight: 14 },
            { date: daysAgo(30), weight: 21 },
            { date: daysAgo(0), weight: 27 }
        ],
        soldFor: null,
    },
    {
        id: 'G-003',
        age: 8,
        breed: 'Boer',
        batch: 'Batch B - Monsoon',
        status: 'Sold',
        purchaseDate: daysAgo(120),
        purchaseCost: 9200,
        purchaseWeight: 18,
        healthLog: [{ date: daysAgo(115), note: 'Vaccinated.' }],
        dailyFeed: [],
        weightHistory: [
            { date: daysAgo(120), weight: 18 },
            { date: daysAgo(90), weight: 26 },
            { date: daysAgo(60), weight: 35 },
            { date: daysAgo(30), weight: 42 }
        ],
        soldFor: 22500,
    },
    {
        id: 'G-004',
        age: 5,
        breed: 'Jamunapari',
        batch: 'Batch B - Monsoon',
        status: 'Active',
        purchaseDate: daysAgo(45),
        purchaseCost: 8100,
        purchaseWeight: 16,
        healthLog: [],
        dailyFeed: [],
        weightHistory: [
            { date: daysAgo(45), weight: 16 },
            { date: daysAgo(15), weight: 23 },
            { date: daysAgo(0), weight: 26 }
        ],
        soldFor: null,
    },
    {
        id: 'G-005',
        age: 7,
        breed: 'Sirohi',
        batch: 'Batch B - Monsoon',
        status: 'Died',
        purchaseDate: daysAgo(100),
        purchaseCost: 7500,
        purchaseWeight: 13,
        healthLog: [{ date: daysAgo(80), note: 'Showed signs of illness.' }, { date: daysAgo(78), note: 'Died due to infection.' }],
        dailyFeed: [],
        weightHistory: [
            { date: daysAgo(100), weight: 13 },
            { date: daysAgo(80), weight: 15 }
        ],
        soldFor: null,
    }
];

export const initialBatches = {
    'Batch A - Summer': { startDate: daysAgo(60) },
    'Batch B - Monsoon': { startDate: daysAgo(45) },
};

export const initialFeedInventory = [
    { id: 'feed-1', name: 'TMR Mix', quantity: 500, unit: 'kg' },
    { id: 'feed-2', name: 'Silage Plus', quantity: 800, unit: 'kg' },
    { id: 'feed-3', name: 'Mineral Supplement', quantity: 50, unit: 'kg' },
];

export const initialExpenses = [
    { id: 'exp-1', date: daysAgo(60), category: 'Livestock Purchase', amount: 16300, description: 'Purchase of G-001, G-002' },
    { id: 'exp-2', date: daysAgo(58), category: 'Feed', amount: 25000, description: 'TMR Mix Bulk Order' },
    { id: 'exp-3', date: daysAgo(45), category: 'Livestock Purchase', amount: 8100, description: 'Purchase of G-004' },
    { id: 'exp-4', date: daysAgo(30), category: 'Medical', amount: 3500, description: 'Deworming medication for Batch A' },
    { id: 'exp-5', date: daysAgo(10), category: 'Labor', amount: 15000, description: 'Monthly labor charges' },
];

export const initialIncome = [
    { id: 'inc-1', date: daysAgo(30), goatId: 'G-003', amount: 22500, description: 'Sale of Goat G-003' },
];

