/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// -- Rides / Bookings

exports.up = function (knex) {
  return knex.schema.createTable("rides", function (table) {
    table.bigIncrements("id");
    table.bigInteger("franchise_id").unsigned().nullable().references("id").inTable("franchises");
    
    table.bigInteger("rider_id").unsigned().notNullable().references("id").inTable("users");
    table.bigInteger("driver_id").unsigned().nullable().references("id").inTable("drivers").onDelete('SET NULL');
    table.bigInteger('vehicle_type_id').unsigned().notNullable().references('id').inTable('vehicle_types').onDelete('SET NULL');
    table.bigInteger("vehicle_id").unsigned().nullable().references("id").inTable("vehicles").onDelete("SET NULL");

    table.string('pickup_address').nullable();
    table.string('drop_address').nullable();

    table.double("pickup_lat").notNullable();
    table.double("pickup_lng").notNullable();

    table.double("drop_lat").notNullable();
    table.double("drop_lng").notNullable();

    table.decimal('distance_km', 10, 2).defaultTo(0);
    table.decimal('duration_minutes', 10, 2).defaultTo(0);

    table.dateTime("scheduled_time").nullable();

    table.enu("status", [
      "requested",
      "accepted",
      "en_route_pickup",
      "arrived_pickup",
      "in_progress",
      "completed",
      "no_driver_found",
      "cancelled"
    ]).defaultTo("requested");

    table.decimal("fare_estimate", 20, 6).nullable();
    table.decimal("fare_final", 20, 6).nullable();

    table.timestamp('ride_picked_at').nullable();
    table.timestamp('ride_dropped_at').nullable();

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("rides");
};
