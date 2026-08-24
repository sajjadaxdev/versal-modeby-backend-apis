/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable("driver_verification_reviews", function (table) {

        table.bigIncrements("id").primary();
        table.bigInteger("driver_id").notNullable().references("id").inTable("drivers").onDelete("CASCADE");
        table.enu("document_type", ['personal_picture', 'cnic_front', 'cnic_back', 'license_front', 'license_selfie', 'vehicle', 'overall']).notNullable();
         table.enu("action", ["approved", "rejected"]).notNullable();
        table.string("reason", 500).nullable();
        table.bigInteger("reviewed_by").nullable();
        table.timestamp("created_at", {useTz: true}).defaultTo(knex.fn.now()).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("driver_verification_reviews");
};