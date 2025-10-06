import express from 'express';
import {
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
} from '../controllers/data.js';
import auth from '../middleware/auth.js'; // Correctly import the default export

const router = express.Router();

// All routes are now protected by the 'auth' middleware
router.get('/all', auth, getAllData);

router.post('/goats', auth, addGoat);
router.put('/goats/:id', auth, updateGoat);
router.post('/goats/:id/weight', auth, recordWeight);
router.post('/goats/:id/sell', auth, sellGoat);

// NEW ROUTES for health and breeding
router.post('/goats/:id/medical', auth, addMedicalRecord);
router.post('/goats/:id/breeding', auth, addBreedingRecord);

router.post('/expenses', auth, addExpense);
router.post('/feed-stock', auth, addFeedStock);
router.post('/feed-log', auth, logFeed);

export default router;