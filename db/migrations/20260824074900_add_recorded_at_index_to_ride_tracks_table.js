/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("ride_tracks", (table) => {
        table.index(["ride_id", "recorded_at"], "ride_tracks_ride_recorded_idx");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable("ride_tracks", (table) => {
        table.dropIndex(
            ["ride_id", "recorded_at"],
            "ride_tracks_ride_recorded_idx"
        );
    });
};