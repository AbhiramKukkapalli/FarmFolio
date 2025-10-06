import mongoose from 'mongoose';

const weightHistorySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    weight: { type: Number, required: true },
});

// NEW: Structured schema for medical records
const MedicalRecordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    eventType: {
        type: String,
        required: true,
        enum: ['Vaccination', 'Treatment', 'Deworming', 'Check-up', 'Other']
    },
    medication: { type: String },
    dosage: { type: String },
    notes: { type: String },
    reminderDate: { type: Date } // For scheduling follow-ups/notifications
});

// NEW: Schema for breeding records
const BreedingRecordSchema = new mongoose.Schema({
    sireId: { type: String, required: true }, // The ID of the father goat
    breedingDate: { type: Date, required: true },
    dueDate: { type: Date },
    outcome: { type: String, enum: ['Pending', 'Gave Birth', 'Failed'], default: 'Pending' },
    offspring: [{ type: String }] // Array of Goat IDs for the offspring
});

const goatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goatId: { type: String, required: true },
    age: { type: Number, required: true },
    breed: { type: String, required: true },
    batch: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Sold', 'Died'], default: 'Active' },
    purchaseDate: { type: Date, default: Date.now },
    purchaseCost: { type: Number, required: true },
    purchaseWeight: { type: Number, required: true },

    // UPDATED: Simple health log is replaced by structured medical records
    medicalRecords: [MedicalRecordSchema],
    breedingRecords: [BreedingRecordSchema],

    weightHistory: [weightHistorySchema],
    soldFor: { type: Number },
}, { timestamps: true });

// Ensure the goatId is unique per user
goatSchema.index({ userId: 1, goatId: 1 }, { unique: true });

const Goat = mongoose.model('Goat', goatSchema);
export default Goat;