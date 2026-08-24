/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("franchises", (table) => {

        table
            .enu("ownership_type", ["company", "franchise"])
            .notNullable()
            .defaultTo("company");

        table
            .boolean("is_head_office")
            .notNullable()
            .defaultTo(false);

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
    return knex.schema.alterTable("franchises", (table) => {

        table.dropColumn("is_head_office");
        table.dropColumn("ownership_type");

    });

};
