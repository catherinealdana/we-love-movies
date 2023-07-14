exports.up = function (knex) {
  return knex.schema.createTable("movies", (table) => {
    table.increments("movie_id").primary();
    table.integer("runtime_in_minutes");
    table.text("description");
    table.string("title");
    table.string("rating");
    table.string("image_url");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("movies");
};
  
