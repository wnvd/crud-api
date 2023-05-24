const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const logger = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const mongoSanitize = require("express-mongo-sanitize");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/db");
// loading env vars
dotenv.config({ path: "./config/config.env" });
// connect to db
connectDB();
// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const users = require("./routes/users");
const auth = require("./routes/auth");
const reviews = require("./routes/reviews");

const app = express();
// Body parser
app.use(express.json());
// cookie parser
app.use(cookieParser());
// File Uploading
app.use(fileUpload());
// Sanitize data 
app.use(mongoSanitize());

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount Routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

// Error Handler
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
// logger
if ((process.env.NODE_ENV = "development")) {
  app.use(logger("dev"));
}

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold,
  ),
);

// handle unhandle promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.underline);
  // Close server & exit
  server.close(() => process.exit(1));
});
