require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
