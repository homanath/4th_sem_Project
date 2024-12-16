const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/indexRoute");

const app = express();
require("dotenv").config();


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", routes); // All routes will be prefixed with /api

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
