import asyncHandler from 'express-async-handler';
import Goat from '../models/Goat.js';
import { Batch, FeedInventory, Expense, Income, FeedLog } from '../models/models.js';

// ... (getAllData, addGoat, updateGoat, etc. functions remain the same)
// @desc    Fetch all data for the logged-in user
// @route   GET /api/data/all
// @access  Private
const getAllData = asyncHandler(async (req, res) => {
    const [goats, batches, feedInventory, expenses, income, feedLog] = await Promise.all([
        Goat.find({ userId: req.user._id }),
        Batch.find({ userId: req.user._id }),
        FeedInventory.find({ userId: req.user._id }),
        Expense.find({ userId: req.user._id }),
        Income.find({ userId: req.user._id }),
        FeedLog.find({ userId: req.user._id })
    ]);

    const batchesObject = batches.reduce((acc, batch) => {
        acc[batch.name] = { startDate: batch.startDate, _id: batch._id };
        return acc;
    }, {});

    res.status(200).json({ goats, batches: batchesObject, feedInventory, expenses, income, feedLog });
});


// @desc    Add a new goat
// @route   POST /api/data/goats
// @access  Private
const addGoat = asyncHandler(async (req, res) => {
    const { age, breed, batch, purchaseCost, purchaseWeight } = req.body;

    // --- NEW: Robust Goat ID Generation ---
    // Find the last goat created by this user to determine the next ID
    const lastGoat = await Goat.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    let newGoatNumber = 1;
    if (lastGoat && lastGoat.goatId) {
        // Safely parse the number from the last goat's ID (e.g., 'G-001' -> 1)
        const lastGoatNumber = parseInt(lastGoat.goatId.split('-')[1]);
        if (!isNaN(lastGoatNumber)) {
            newGoatNumber = lastGoatNumber + 1;
        }
    }

    const goatId = `G-${String(newGoatNumber).padStart(3, '0')}`;
    // --- End of New Logic ---

    // Create new Batch if it doesn't exist for this user
    let batchDoc = await Batch.findOne({ name: batch, userId: req.user._id });
    let newBatch = null;
    if (!batchDoc) {
        batchDoc = await Batch.create({ name: batch, startDate: new Date(), userId: req.user._id });
        newBatch = batchDoc;
    }

    const newGoat = await Goat.create({
        userId: req.user._id,
        goatId,
        age,
        breed,
        batch,
        purchaseCost,
        purchaseWeight,
        weightHistory: [{ date: new Date(), weight: purchaseWeight }],
        medicalRecords: [{ date: new Date(), eventType: 'Check-up', notes: 'Initial purchase and checkup.' }],
    });

    const newExpense = await Expense.create({
        userId: req.user._id,
        date: new Date(),
        category: 'Livestock Purchase',
        amount: purchaseCost,
        description: `Purchase of Goat ${goatId}`
    });

    res.status(201).json({ newGoat, newExpense, newBatch });
});


// @desc    Update an existing goat's details
// @route   PUT /api/data/goats/:id
// @access  Private
const updateGoat = asyncHandler(async (req, res) => {
    const goat = await Goat.findById(req.params.id);

    if (goat) {
        // Check that the goat belongs to the user trying to edit it
        if (goat.userId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized');
        }

        goat.batch = req.body.batch || goat.batch;
        goat.breed = req.body.breed || goat.breed;
        goat.status = req.body.status || goat.status;

        const updatedGoat = await goat.save();
        res.status(200).json(updatedGoat);
    } else {
        res.status(404);
        throw new Error('Goat not found');
    }
});


// @desc    Record a new weight for a goat
// @route   POST /api/data/goats/:id/weight
// @access  Private
const recordWeight = asyncHandler(async (req, res) => {
    const { weight } = req.body;
    const goat = await Goat.findById(req.params.id);

    if (goat) {
        if (goat.userId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized');
        }
        goat.weightHistory.push({ date: new Date(), weight: parseFloat(weight) });
        const updatedGoat = await goat.save();
        res.status(200).json(updatedGoat);
    } else {
        res.status(404);
        throw new Error('Goat not found');
    }
});

// @desc    Sell a goat
// @route   POST /api/data/goats/:id/sell
// @access  Private
const sellGoat = asyncHandler(async (req, res) => {
    const { salePrice } = req.body;
    const goat = await Goat.findById(req.params.id);

    if (goat) {
        if (goat.userId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized');
        }

        goat.status = 'Sold';
        goat.soldFor = parseFloat(salePrice);
        const updatedGoat = await goat.save();

        const newIncome = await Income.create({
            userId: req.user._id,
            date: new Date(),
            goatId: goat.goatId,
            amount: parseFloat(salePrice),
            description: `Sale of Goat ${goat.goatId}`
        });

        res.status(200).json({ updatedGoat, newIncome });
    } else {
        res.status(404);
        throw new Error('Goat not found');
    }
});


// --- Other Financial & Feed Actions ---

// @desc    Add a new expense
// @route   POST /api/data/expenses
// @access  Private
const addExpense = asyncHandler(async (req, res) => {
    const { category, amount, description } = req.body;
    const newExpense = await Expense.create({
        userId: req.user._id,
        date: new Date(),
        category,
        amount,
        description
    });
    res.status(201).json(newExpense);
});

// @desc    Add new feed stock
// @route   POST /api/data/feed-stock
// @access  Private
const addFeedStock = asyncHandler(async (req, res) => {
    const { name, quantity, cost, unit } = req.body;

    let feedItem = await FeedInventory.findOne({ name, userId: req.user._id });
    if (feedItem) {
        feedItem.quantity += parseFloat(quantity);
    } else {
        feedItem = new FeedInventory({ name, quantity: parseFloat(quantity), unit, userId: req.user._id });
    }
    const updatedFeedItem = await feedItem.save();

    const newExpense = await Expense.create({
        userId: req.user._id,
        date: new Date(),
        category: 'Feed',
        amount: parseFloat(cost),
        description: `Purchased ${quantity}${unit} of ${name}`
    });

    res.status(201).json({ updatedFeedItem, newExpense });
});


// @desc    Log a feeding session
// @route   POST /api/data/feed-log
// @access  Private
const logFeed = asyncHandler(async (req, res) => {
    const { target, feedName, quantity } = req.body;

    const newFeedLog = await FeedLog.create({
        userId: req.user._id,
        date: new Date(),
        target, // e.g., 'Batch A' or 'all'
        feedName,
        quantity: parseFloat(quantity)
    });

    const feedItem = await FeedInventory.findOne({ name: feedName, userId: req.user._id });
    let updatedFeedItem = null;
    if (feedItem) {
        feedItem.quantity -= parseFloat(quantity);
        updatedFeedItem = await feedItem.save();
    }

    res.status(201).json({ newFeedLog, updatedFeedItem });
});

// NEW: Add a medical record to a goat
const addMedicalRecord = asyncHandler(async (req, res) => {
    const goat = await Goat.findById(req.params.id);
    if (goat && goat.userId.toString() === req.user._id.toString()) {
        const newRecord = { ...req.body, date: new Date() };
        goat.medicalRecords.push(newRecord);
        const updatedGoat = await goat.save();
        res.status(201).json(updatedGoat);
    } else {
        res.status(404);
        throw new Error('Goat not found or not authorized');
    }
});

// NEW: Add a breeding record to a goat
const addBreedingRecord = asyncHandler(async (req, res) => {
    const goat = await Goat.findById(req.params.id);
    if (goat && goat.userId.toString() === req.user._id.toString()) {
        // Example: Automatically calculate due date (approx. 150 days for goats)
        const breedingDate = new Date(req.body.breedingDate);
        const dueDate = new Date(breedingDate.setDate(breedingDate.getDate() + 150));

        const newRecord = { ...req.body, dueDate };
        goat.breedingRecords.push(newRecord);
        const updatedGoat = await goat.save();
        res.status(201).json(updatedGoat);
    } else {
        res.status(404);
        throw new Error('Goat not found or not authorized');
    }
});

export {
    getAllData,
    addGoat,
    updateGoat,
    recordWeight,
    sellGoat,
    addExpense,
    addFeedStock,
    logFeed,
    addMedicalRecord,
    addBreedingRecord
};