const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const recipeRoutes = require('./routes/recipe');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend');
console.log('===================================');
console.log('DEBUG: Frontend Path:', frontendPath);
if (fs.existsSync(frontendPath)) {
  console.log('DEBUG: Frontend folder exists.');
  try {
    console.log('DEBUG: Files in frontend:', fs.readdirSync(frontendPath));
  } catch (e) {
    console.log('DEBUG: Error reading frontend folder:', e.message);
  }
} else {
  console.error('DEBUG: ERROR - Frontend folder NOT FOUND at:', frontendPath);
}
console.log('===================================');

app.use(express.static(frontendPath));

// Explicit Root Route to fix 403
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

// Connect to Database
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

