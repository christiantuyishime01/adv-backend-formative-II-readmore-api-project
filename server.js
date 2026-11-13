require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const authorRoutes = require("./routes/authorRoutes");

const bookRoutes = require("./routes/bookRoutes");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/authors", authorRoutes);
app.use("/books", bookRoutes);

app.get("/", (req, res) => {
    res.json({ message: "ReadMore API is running" });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

startServer();
