// Import required modules
const express = require('express');
const mongoose = require('mongoose');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// MongoDB connection URI
const uri = 'mongodb+srv://react:ldyCg1Xr9sqqs32C@react.1ows0.mongodb.net/?retryWrites=true&w=majority&appName=react';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

// Call the connection function
connectDB();

// Define a simple schema and model for users
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

const User = mongoose.model('User', userSchema);

// API Route: Create a new user
app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;

    try {
        const newUser = new User({ name, email });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);  // Send saved user back as JSON
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user', details: error });
    }
});

// API Route: Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();  // Retrieve all users from the database
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users', details: error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
