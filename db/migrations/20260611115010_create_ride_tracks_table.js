/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// -- Har 2-5 seconds me point insert hota hai sirf active ride ke dauran.

exports.up = function (knex) {
    return knex.schema.createTable("ride_tracks", function (table) {
        table.bigIncrements("id");

        table.bigInteger("ride_id").unsigned().references("id").inTable("rides").onDelete("CASCADE");

        table.decimal("latitude", 20, 6);
        table.decimal("longitude", 20, 6);

        table.smallint("heading").nullable();
        table.decimal("speed", 5, 2).nullable();

        table.timestamp("recorded_at").defaultTo(knex.fn.now());
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("ride_tracks");
};
