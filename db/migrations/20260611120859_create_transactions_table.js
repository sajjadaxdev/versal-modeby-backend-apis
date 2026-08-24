/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("transactions", function (table) {
        table.bigIncrements("id");
        table.bigInteger("wallet_id").unsigned().notNullable().references("id").inTable("wallets").onDelete("CASCADE");
        table.enu("type", ["credit", "debit"]).notNullable();
        table.decimal("amount", 20, 6).notNullable();
        table.string("description").nullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("transactions");
};
