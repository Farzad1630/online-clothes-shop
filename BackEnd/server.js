const express = require("express");
const dotenv = require("dotenv");
const sql = require("mssql");
const dbConfig = require("./config/db");
const userRoutes = require("./routes/users");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

sql.connect(dbConfig)
  .then(() => console.log("✅ Connected to MSSQL"))
  .catch(err => console.error("❌ Database connection failed:", err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
