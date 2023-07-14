const asyncErrorBoundary = require("../utils/errors/asyncErrorBoundary");
const service = require("./theaters.service");

async function list(req, res) {
  const theaters = await service.list();
  const theatersAndMovies = [];
  for (let i = 0; i < theaters.length; i++) {
    const theater = theaters[i];
    const { theater_id } = theater;
    const movies = await service.getMovies(theater_id);
    const moviesInTheaters = { ...theater, movies: movies };
    theatersAndMovies.push(moviesInTheaters);
  }
  res.status(200).json({ data: theatersAndMovies });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
};