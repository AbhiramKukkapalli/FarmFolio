import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
export const User = mongoose.model('User', userSchema);


const batchSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
});
export const Batch = mongoose.model('Batch', batchSchema);


const feedInventorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
});
export const FeedInventory = mongoose.model('FeedInventory', feedInventorySchema);


const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
});
export const Expense = mongoose.model('Expense', expenseSchema);


const incomeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    goatId: { type: String },
    amount: { type: Number, required: true },
    description: { type: String },
});
export const Income = mongoose.model('Income', incomeSchema);


const feedLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    target: { type: String, required: true }, // e.g., 'Batch A' or 'all'
    feedName: { type: String, required: true },
    quantity: { type: Number, required: true },
});
export const FeedLog = mongoose.model('FeedLog', feedLogSchema);

