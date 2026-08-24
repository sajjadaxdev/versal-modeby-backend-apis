/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("currency_configs", (table) => {
        table.increments("id").primary();
        table.string("name", 100).notNullable();          // Pakistani Rupee
        table.string("code", 10).notNullable().unique();  // PKR
        table.string("symbol", 10).notNullable();         // Rs
        table.enum("symbol_position", ["before", "after"]).defaultTo("before");
        table.integer("decimal_places").defaultTo(2);
        table.string("decimal_separator", 5).defaultTo(".");
        table.string("thousand_separator", 5).defaultTo(",");
        table.boolean("is_default").defaultTo(false);
        table.boolean("is_active").defaultTo(true);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("currency_configs");
};
