import * as dotenv from "dotenv";
import express from "express";
import mogran from "morgan";

// loading env vars
dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT || 5000;
//loggin
app.use(mogran("tiny"));

app.get("/h");

app.listen(
  PORT,
  console.log(`Server runing in ${process.env.NODE_ENV} mode on port ${PORT}`),
);
