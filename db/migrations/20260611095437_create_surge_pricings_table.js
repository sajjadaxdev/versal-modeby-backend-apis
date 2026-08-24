/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('surge_pricings', (table) => {
        table.increments('id').primary();

        table.integer('city_id').unsigned().references('id').inTable('cities').onDelete('CASCADE');
        table.integer('vehicle_type_id').unsigned().references('id').inTable('vehicle_types').onDelete('CASCADE');
        table.decimal('multiplier', 5, 2).defaultTo(1);
        table.time('start_time').notNullable();
        table.time('end_time').notNullable();
        table.boolean('is_active').defaultTo(true);

        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('surge_pricings');
};
