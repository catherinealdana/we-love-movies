const knex = require("../db/connection");

async function list() {
  return await knex("reviews");
}

async function read(reviewId) {
  return await knex("reviews").where({ review_id: reviewId });
}

async function update(updatedReview, reviewId) {
  const currentDate = new Date();
  const updatedRecords = await knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .update({ ...updatedReview, updated_at: currentDate });
  return updatedRecords[0];
}

async function getCritic(criticId) {
  return await knex("critics").where({ critic_id: criticId }).select();
}

async function destroy(reviewId) {
  await knex("reviews").where({ review_id: reviewId }).del();
}

module.exports = {
  list,
  read,
  update,
  getCritic,
  destroy,
};
