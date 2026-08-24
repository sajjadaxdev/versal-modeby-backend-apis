/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("user_permissions", function (table) {

        table.increments("id").primary();
        table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
        table.integer("permission_id").unsigned().references("id").inTable("permissions").onDelete("CASCADE");
        table.unique(["user_id", "permission_id"]);

        table.timestamps(true, true);

    });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("user_permissions");
};
