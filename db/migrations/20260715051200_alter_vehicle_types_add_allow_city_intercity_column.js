/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable("vehicle_types", (table) => {

        table.boolean("allow_city_ride").notNullable().defaultTo(true).after("is_active");
        table.boolean("allow_intercity_ride").notNullable().defaultTo(false).after("allow_city_ride");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable("vehicle_types", (table) => {
        table.dropColumn("allow_city_ride");
        table.dropColumn("allow_intercity_ride");
    });
};
