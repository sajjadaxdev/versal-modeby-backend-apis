/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("roles", function (table) {

        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("slug").unique().notNullable();
        table.text("description").nullable();
        table.boolean("is_active").defaultTo(true);
        table.timestamps(true, true);
        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("roles");
};
