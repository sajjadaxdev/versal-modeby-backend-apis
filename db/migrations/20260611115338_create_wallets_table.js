/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("wallets", function (table) {
    table.bigIncrements("id");
    table.bigInteger("user_id").unsigned().notNullable().unique().references("id").inTable("users").onDelete("CASCADE");
    table.decimal("balance", 20, 6).defaultTo(0);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("wallets");
};
