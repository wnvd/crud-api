const dotenv = require("dotenv");
const express = require("express");
const logger = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
// loading env vars
dotenv.config({ path: "./config/config.env" });
// connect to db
connectDB();
// Route files
const bootcamps = require("./routes/bootcamps");

const app = express();
// Mount Routers
app.use("/api/v1/bootcamps", bootcamps);
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
