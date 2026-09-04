/**
 * Add final ride distance and duration fields.
 *
 * distance_km / duration_minutes
 * --------------------------------
 * Original route estimate calculated when ride was requested.
 *
 * final_distance_km / final_duration_minutes
 * --------------------------------------------
 * Actual values calculated when ride is completed.
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable("rides", (table) => {
        table.decimal("final_distance_km", 10, 2).nullable().comment("Actual distance travelled during the ride in kilometers.");
        table.decimal("final_duration_minutes", 10, 2).nullable().comment("Actual ride duration in minutes.");
    });
}


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {

    await knex.schema.alterTable("rides", (table) => {
        table.dropColumn("final_distance_km");
        table.dropColumn("final_duration_minutes");
    });
}