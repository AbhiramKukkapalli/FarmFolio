import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { User } from './models/models.js';

// Configure dotenv to find the .env file in the parent directory
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Clear existing users to avoid duplicates
        await User.deleteMany();

        const hashedPassword = await bcrypt.hash('kukkapalli', 12);

        const defaultUser = new User({
            username: 'kukkapalli',
            password: hashedPassword,
        });

        await defaultUser.save();

        console.log('Default user has been created successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();

