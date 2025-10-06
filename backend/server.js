import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';

// Get the directory name of the current module to reliably find the .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parentDir = path.resolve(__dirname, '..');

// Configure dotenv to find the .env file in the parent directory (project root)
dotenv.config({ path: path.resolve(parentDir, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// --- START PRODUCTION CONFIGURATION ---
if (process.env.NODE_ENV === 'production') {
    // Set static folder - Vite outputs to 'dist' in the project root
    app.use(express.static(path.join(parentDir, 'dist')));

    // Any request not handled by the API routes should serve the frontend's index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(parentDir, 'dist', 'index.html'));
    });
}
// --- END PRODUCTION CONFIGURATION ---

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`Backend server running on port: ${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));

