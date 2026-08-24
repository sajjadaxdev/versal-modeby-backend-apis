/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("vehicle_types", (table) => {

        table.string("slug", 255).unique();
        table.integer("seating_capacity").defaultTo(1);
        table.integer("display_order").defaultTo(0);

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable("vehicle_types", (table) => {

        table.dropUnique(["slug"]);
        table.dropColumn("slug");
        table.dropColumn("seating_capacity");
        table.dropColumn("display_order");

    });
};