/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// -- Current_Locations (real-time)
// -- 1 record per driver, update hoti rehti hai Every (2-5) seconds

exports.up = function (knex) {
  return knex.schema.createTable("driver_location", function (table) {
    table.bigIncrements("id");
    table.bigInteger("driver_id").unsigned().notNullable().unique().references("id").inTable("drivers").onDelete("CASCADE");
    table.doublePrecision("latitude").notNullable();
    table.doublePrecision("longitude").notNullable();

    table.doublePrecision("heading").nullable();
    table.doublePrecision("speed").nullable();
    table.timestamp("last_update").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("driver_location");
};
