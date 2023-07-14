const knex = require("../db/connection");

async function list() {
  return await knex("theaters");
}

async function getMovies(theaterId) {
  return await knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .select("m.*", "mt.is_showing")
    .where({ "t.theater_id": theaterId });
}

module.exports = {
  list,
  getMovies,
};
