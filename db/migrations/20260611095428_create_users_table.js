/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("users", function (table) {
        table.increments("id").primary();
        table.bigInteger("franchise_id").unsigned().nullable().references("id").inTable("franchises").onDelete("SET NULL");
        table.string("username").nullable();
        table.string("phone").nullable().unique();
        table.string("email").nullable().unique();
        table.string("password").nullable();
        table.string("avatar").nullable();
        // table.enu("role", ["rider", "driver", "super_admin", "franchise_admin", "call_center"]).defaultTo("rider");
        table.text("fcm_id").nullable()
        table.text("google_id", 2048).nullable();
        table.boolean("is_active").defaultTo(true);
        table.string("otp_code", 10).nullable();
        table.timestamp("otp_expires_at").nullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.schema.dropTable("users");
};
