/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
     await knex.schema.alterTable("drivers", function (table) {
        
        table.enu("personal_picture_verification_status", ["pending", "approved", "rejected"]).defaultTo("pending");
        table.enu("cnic_front_verification_status", ["pending", "approved", "rejected"]).defaultTo("pending");
        table.enu("cnic_back_verification_status", ["pending", "approved", "rejected"]).defaultTo("pending");
        table.enu("license_front_verification_status", ["pending", "approved", "rejected"]).defaultTo("pending");
        table.enu("license_selfie_verification_status", ["pending", "approved", "rejected"]).defaultTo("pending");

    });

    await knex.schema.alterTable("vehicles", function (table) {

        table.enu("vehicle_verification_status", ["pending", "approved", "rejected"]).defaultTo("pending");

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async  function(knex) {
    await knex.schema.alterTable("drivers", function (table) {

        table.dropColumn("personal_picture_verification_status");
        table.dropColumn("cnic_front_verification_status");
        table.dropColumn("cnic_back_verification_status");
        table.dropColumn("license_front_verification_status");
        table.dropColumn("license_selfie_verification_status");

    });
    await knex.schema.alterTable("vehicles", function (table) {

        table.dropColumn("vehicle_verification_status");

    });
};
