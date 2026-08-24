/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
*/
exports.up = function(knex) {
    return knex.schema.createTable("vehicles", (table) => {

        table.bigIncrements("id");
        table.bigInteger("driver_id").unsigned().nullable().references("id").inTable("drivers").onDelete("CASCADE");
        table.bigInteger("vehicle_type_id").unsigned().notNullable().references("id").inTable("vehicle_types").onDelete('RESTRICT');
        table.string("make").nullable();
        table.string("model").nullable();
        table.string("year").nullable();
        table.string("color").nullable();
        table.string("registration_number").nullable().unique();
        table.string("vehicle_image").nullable();
        table.boolean('is_verified').defaultTo(false);
        table.boolean("is_active").defaultTo(true);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
*/
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("vehicles");
};
