/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("vehicle_owners", function (table) {

        table.bigIncrements("id");
        table.bigInteger("vehicle_id").unsigned().notNullable().references("id").inTable("vehicles").onDelete("CASCADE");
        table.enu("owner_type", ["business", "franchise", "driver", "partner"]).notNullable();
        table.bigInteger("owner_id").unsigned().notNullable();
        table.decimal("ownership_percentage", 5, 2).defaultTo(100);
        table.timestamps(true, true);
        table.index(["vehicle_id"]);
        table.index(["owner_type", "owner_id"]);
        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("vehicle_owners");
};