/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("drivers", function (table) {
    table.bigIncrements("id");
    table.bigInteger("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("license_number", 50).nullable();
    table.enu("verification_status", ["draft", "submitted", "under_review", "approved", "rejected"]).defaultTo("draft");
    table.decimal("rating", 3, 2).defaultTo(0);
    table.boolean("is_online").defaultTo(false);
    table.boolean("is_available").defaultTo(true);
    table.timestamps(true, true);
  });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("drivers");
};
