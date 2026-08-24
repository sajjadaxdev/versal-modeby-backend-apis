/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

    return knex.schema.createTable("notifications", (table) => {

        table.bigIncrements("id").primary();
        table.bigInteger("user_id").unsigned().notNullable().index();
        /*
        |--------------------------------------------------------------------------
        | Notification Type
        |--------------------------------------------------------------------------
        |
        | Examples:
        | driver_document_review
        | ride_accepted
        | ride_cancelled
        | chat_message
        | test_notification
        |
        */
        table.string("type", 100).notNullable().index();
        /*
        |--------------------------------------------------------------------------
        | Content
        |--------------------------------------------------------------------------
        */
        table.string("title", 255).notNullable();
        table.text("body").notNullable();
        /*
        |--------------------------------------------------------------------------
        | Notification Data
        |--------------------------------------------------------------------------
        |
        | Stores navigation/action related data.
        |
        | Example:
        | {
        |     "screen": "driver_document",
        |     "driver_id": "10",
        |     "document_type": "cnic_front"
        | }
        |
        */
        table.jsonb("data").nullable();
        /*
        |--------------------------------------------------------------------------
        | Read Status
        |--------------------------------------------------------------------------
        */
        table.boolean("is_read").notNullable().defaultTo(false).index();
        table.timestamp("read_at").nullable();
        /*
        |--------------------------------------------------------------------------
        | Timestamps
        |--------------------------------------------------------------------------
        */
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("notifications");
};
