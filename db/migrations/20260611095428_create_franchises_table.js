/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("franchises", function (table) {
        table.bigIncrements("id");
        table.bigInteger("business_id").unsigned().notNullable().references("id").inTable("business").onDelete("CASCADE");
        table.string("name").notNullable();
        table.string("code").unique();
        table.string("address");
        table.boolean("is_active").defaultTo(true);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("franchises");
};
