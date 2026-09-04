/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {

    return knex.schema.alterTable("ride_tracks", (table) => {
        table
            .specificType("heading", "double precision")
            .nullable()
            .alter();
    });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable("ride_tracks", (table) => {
        table
            .specificType("heading", "smallint")
            .nullable()
            .alter();
    });
};