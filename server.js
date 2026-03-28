require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Restrict in production
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

//routes
app.use("/api/auth", require("./routes/authRoutes"));

//health check
app.get("/", (req, res) => {
  res.json({ 
    message: "Arcade API running", 
    status: "healthy",
    environment: process.env.NODE_ENV 
  });
});

//error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

//404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});