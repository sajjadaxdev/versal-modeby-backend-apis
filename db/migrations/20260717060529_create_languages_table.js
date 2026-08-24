/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("languages", (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable();
    table.string("code", 10).notNullable().unique();
    table.string("direction", 3).defaultTo("ltr").checkIn(["ltr", "rtl"]); // 👈 enum ki jagah
    table.boolean("is_active").defaultTo(true);
    table.boolean("is_default").defaultTo(false);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("translations", (table) => {
    table.increments("id").primary();
    table.string("lang_code", 10).notNullable();
    table.string("key_name", 100).notNullable();
    table.text("value").notNullable();
    table.timestamps(true, true);
    table.unique(["lang_code", "key_name"]);
  });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async  function(knex) {
  await knex.schema.dropTableIfExists("translations");
  await knex.schema.dropTableIfExists("languages");
};
