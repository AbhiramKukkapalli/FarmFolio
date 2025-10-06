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

// This variable will point to the root 'goat-farm-app/' directory
const parentDir = path.resolve(__dirname, '..'); 

// Configure dotenv to find the .env file in the project root
dotenv.config({ path: path.resolve(parentDir, '.env') }); 

const app = express();
app.use(cors());
app.use(express.json());

// 1. API Routes - These must come first to avoid being caught by the client router
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

const PORT = process.env.PORT || 5001;

// --- START PRODUCTION CONFIGURATION ---
if (process.env.NODE_ENV === 'production') {
    // 2. Serve static assets from the 'dist' folder at the root path '/'
    app.use(express.static(path.join(parentDir, 'dist')));

    // 3. Catch-all: For any request not matching the APIs or static files, send the index.html
    // This hands control to the React client-side router (e.g., App.jsx).
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(parentDir, 'dist', 'index.html'));
    });
}
// --- END PRODUCTION CONFIGURATION ---

mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`Backend server running on port: ${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));
