require("dotenv").config(); 

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/performance", require("./routes/performanceRoutes"));

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});