/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("drivers", function (table) {

        table.string("personal_picture").nullable().after("user_id");

        table.string("cnic_front_side_picture").nullable();
        table.string("cnic_back_side_picture").nullable();

        table.string("first_name", 100).nullable();
        table.string("last_name", 100).nullable();
        
        table.date("dob").nullable();
        
        table.string("license_front_side_picture").nullable();
        table.string("selfie_with_driver_license").nullable();
        
        table.date("license_expiration_date").nullable();
        table.string("rejection_reason", 400).nullable();

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

    return knex.schema.alterTable("drivers", function (table) {

        table.dropColumn("personal_picture");

        table.dropColumn("cnic_front_side_picture");
        table.dropColumn("cnic_back_side_picture");

        table.dropColumn("first_name");
        table.dropColumn("last_name");
        table.dropColumn("dob");
        table.dropColumn("license_front_side_picture");
        table.dropColumn("selfie_with_driver_license");
        table.dropColumn("license_expiration_date");

    });

};