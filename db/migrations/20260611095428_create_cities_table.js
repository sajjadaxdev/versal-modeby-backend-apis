/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('cities', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.decimal('latitude', 20, 7).nullable();
        table.decimal('longitude', 20, 7).nullable();
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('cities');
};
