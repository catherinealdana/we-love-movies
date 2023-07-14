if (process.env.USER) require("dotenv").config();

const express = require("express");
const cors = require("cors");
const errorHandler = require("./utils/errors/errorHandler");
const notFound = require("./utils/errors/notFound");
const reviewsRouter = require("./reviews/reviews.router");
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/reviews", reviewsRouter);
app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;