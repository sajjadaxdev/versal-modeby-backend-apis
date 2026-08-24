/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
*/
exports.up = function(knex) {
    return knex.schema.createTable('vehicle_types', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('icon').nullable();
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
*/
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('vehicle_types');
};
