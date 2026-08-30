require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const router = require("./router");

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../uploads")));
app.use(router);

module.exports = app;
