const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// To manage user sessions, store user login state and other session
const session = require('express-session');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Set up session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
 }));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
// Adding new dog routes
const dogRoutes = require('./routes/dogRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
// Also added dog api routes
app.use('/api/dogs', dogRoutes);

// Export the app instead of listening here
module.exports = app;