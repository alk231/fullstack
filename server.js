const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require('dotenv');
const server_config=require('./config/server.config')
// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error('MongoDB URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(mongoURI, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1); // exit the process if MongoDB connection fails
});


    app.use(cors());

// Wait for MongoDB connection to be established before starting the server
mongoose.connection.once('open', () => {
    console.log('MongoDB connection established');

    // Example route
    app.get('/', (req, res) => {
        res.send('Hello, MelodyVerse!');
    });
    const userRoutes = require('./routes/userRoutes');
    app.use('/api/users', userRoutes);
    // Start the server
    app.listen(server_config.PORT, () => {
        console.log(`Server is running on port ${server_config.PORT}`);
    });
});