/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('languages', (table) => {
    table.string('native_name', 100).nullable();
    table.string('flag_url', 500).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('languages', (table) => {
    table.dropColumn('native_name');
    table.dropColumn('flag_url');
  });
};
