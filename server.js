const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");

// Route files
const bootcamps = require("./routes/bootcamps");
// loading env vars
dotenv.config({ path: "./config/config.env" });

const app = express();
// Mount Routers
app.use("/api/v1/bootcamps", bootcamps);
const PORT = process.env.PORT || 5000;
//loggin
app.use(morgan("tiny"));

app.listen(
  PORT,
  console.log(`Server runing in ${process.env.NODE_ENV} mode on port ${PORT}`),
);
