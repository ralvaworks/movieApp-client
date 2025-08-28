const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { errorHandler } = require("./auth");

require("dotenv").config();


// [SECTION] Import Routes
const userRoutes = require("./routes/user");
const movieRoutes = require("./routes/movie");



// [SECTION] Server Setup
const app = express();

// To parse json data
app.use(express.json());

const corsOptions = {
   origin: ['http://localhost:8000', 'http://localhost:3000'],
   credentials: true,
   optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// [SECTION] MongoDB Database Connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas."));


// [SECTION] Routes
app.use("/users", userRoutes);
app.use("/movies", movieRoutes);


// [SECTION] Centralized Error Handling
// This should be the last middleware, after all routes.
app.use(errorHandler);


// [SECTION] Server Gateway Response
if (require.main === module) {
   app.listen(process.env.PORT || 3000, () => {
      console.log(`API is now online on port ${process.env.PORT || 3000}`)
   })
}


module.exports = { app, mongoose };