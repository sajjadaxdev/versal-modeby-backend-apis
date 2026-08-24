const bcrypt = require("bcrypt");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  try {

    const user = await knex("users").where({ username: "developer" }).first();

    if (!user) {

      const hashedPassword = await bcrypt.hash("dev-123", 10);

      await knex("users").insert({
        username: "developer",
        password: hashedPassword,
      });

      console.log("Developer user created");

    } else {
      console.log("Developer user already exists");
    }

  } catch (error) {
    console.error("Seed error:", error);
  }
};