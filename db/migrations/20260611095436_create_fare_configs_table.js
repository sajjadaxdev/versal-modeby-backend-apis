/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('fare_configs', (table) => {
        table.increments('id').primary();

        table.integer('city_id').unsigned().references('id').inTable('cities').onDelete('CASCADE');
        table.integer('vehicle_type_id').unsigned().references('id').inTable('vehicle_types').onDelete('CASCADE');
        table.decimal('base_fare', 10, 2).defaultTo(0);
        table.decimal('per_km_rate', 10, 2).defaultTo(0);
        table.decimal('per_min_rate', 10, 2).defaultTo(0);
        table.decimal('minimum_fare', 10, 2).defaultTo(0);
        table.boolean('is_active').defaultTo(true);

        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('fare_configs');
};
