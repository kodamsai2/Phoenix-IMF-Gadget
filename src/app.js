require('dotenv').config()
const express = require('express')
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const { connectToDB } = require('./configs/db');
const userRoutes = require('./routes/userRoutes')
const gadgetRoutes = require('./routes/gadgetRoutes')

const app = express()

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json())

const port = process.env.PORT || 3000

// API Routes
app.use('/api/v1/', userRoutes)
app.use('/api/v1/gadgets', gadgetRoutes)

app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);
  res.status(500).json({ message: 'Global Error: Internal Server Error', success: false });
});

// Start the server, after connecting to the database.
connectToDB()
  .then(() => {
    console.log("Database connected. Starting server...");
    app.listen(port, () => {
      console.log(`IMF Gadget API is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed. Server will not start.");
    console.error(error);
    process.exit(1); // Exit the process if DB connection fails
  });