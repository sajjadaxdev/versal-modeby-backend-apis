/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("business", function (table) {
        table.bigIncrements("id");
        table.string("name").notNullable();
        table.string("slug").unique().notNullable();
        table.string("email").nullable();
        table.string("phone", 30).nullable();
        table.text("address").nullable();
        table.string("logo").nullable();
        table.boolean("is_active").defaultTo(true);
        table.timestamps(true, true);

        table.index(["is_active"], "idx_business_is_active");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("business");
};
