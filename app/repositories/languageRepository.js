import knex from "../../db/knex.js";

export const findAll = async () => {
  return await knex("languages")
    .where({ is_active: true })
    .orderBy("id", "asc");
};

export const findByCode = async (code) => {
  return await knex("languages")
    .where({ code, is_active: true })
    .first();
};

export const findTranslations = async (langCode) => {
  return await knex("translations")
    .where({ lang_code: langCode })
    .select("key_name", "value");
};