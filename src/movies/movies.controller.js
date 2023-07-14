const service = require("./movies.service");
const asyncErrorBoundary = require("../utils/errors/asyncErrorBoundary");
const knex = require("../db/connection");

const chekingParams = async (req, res, next) => {
  const { movieId } = req.params;
  const matching = await service.read(Number(movieId));
  if (matching.length === 0 || !movieId)
    return next({
      status: 404,
      message: `movieId: ${movieId} does not exist in the database`,
    });
  res.locals.movie = matching[0];
  next();
};

function list(req, res) {
  const { is_showing } = req.query;

  if (is_showing === "true") {
    knex("movies as m")
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .select("m.*")
      .where({ "mt.is_showing": true })
      .groupBy("m.movie_id")
      .then((movies) => {
        res.json({ data: movies });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  } else {
    knex("movies")
      .select("*")
      .then((movies) => {
        res.json({ data: movies });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
}





// async function list(req, res) {
//   const { is_showing } = req.query;
//   const data = is_showing ? await (await service.listShowing()).splice(0, 15)
//     : await service.list();
//   //console.log(data) 
//   res.status(200).json({ data: data });
// }

async function read(req, res) {
  res.status(200).json({ data: res.locals.movie });
  console.log(res.locals.movie)
}

async function listReviews(req, res) {
  const movieId = res.locals.movie.movie_id;
  const reviews = await service.listReviews(movieId);
  const allReviews = [];
  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];
    const critic = await service.getCritics(review.critic_id);
    review.critic = critic[0];
    allReviews.push(review);
  }
  res.status(200).json({ data: allReviews });
}

async function listTheaters(req, res) {
  const movieId = res.locals.movie.movie_id;
  const result = await service.listTheaters(movieId);
  res.status(200).json({ data: result });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(chekingParams), asyncErrorBoundary(read)],
  listReviews: [
    asyncErrorBoundary(chekingParams),
    asyncErrorBoundary(listReviews),
  ],
  listTheaters: [
    asyncErrorBoundary(chekingParams),
    asyncErrorBoundary(listTheaters),
  ],
};