/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.schema.createTable("ride_driver_requests", (table) => {
        table.bigIncrements("id").primary();
        table.bigInteger("ride_id").notNullable().references("id").inTable("rides").onDelete("CASCADE");
        table.bigInteger("driver_id").notNullable().references("id").inTable("drivers").onDelete("CASCADE");
        table.text("status").notNullable().defaultTo("pending");
        table.timestamp("requested_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp("responded_at", { useTz: true }).nullable();
        table.timestamp("expires_at", { useTz: true }).nullable();
        table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.unique(["ride_id", "driver_id"]);
        table.check(`status IN ('pending', 'accepted', 'rejected', 'expired')`);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("ride_driver_requests");
};
