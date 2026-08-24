/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("rides", (table) => {
        table.timestamp("cancelled_at").nullable();
        table.text("cancel_reason").nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable("rides", (table) => {
        table.dropColumn("cancelled_at");
        table.dropColumn("cancel_reason");
    });
};
