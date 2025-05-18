const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const apiRoutes = require("./routes/api");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  })
);

// Try more explicit configuration for the JSON middleware
app.use(
  express.json({
    strict: false,
    limit: "10mb",
  })
);
app.use(express.urlencoded({ extended: true })); // Also add this for form data

// Add the logging middleware
app.use((req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Content-Type:", req.headers["content-type"]);
  next();
});

app.use(morgan("dev"));


// Routes
app.use("/api", apiRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
