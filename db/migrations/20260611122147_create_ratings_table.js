/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("ratings", function (table) {
    table.bigIncrements("id");
    table.bigInteger("ride_id").references("id").inTable("rides").onDelete("CASCADE");
    table.bigInteger("rated_by").references("id").inTable("users");
    table.bigInteger("rated_user").references("id").inTable("users");
    table.integer("score").notNullable();
    table.text("comment").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("ratings");
};
