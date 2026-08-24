import knex from "../../db/knex.js";

export const create = async (data) => {
    return await knex("riders")
        .insert(data)
        .returning("*");
};

export const findByUserId = async (userId) => {
    return await knex("riders")
        .where({ user_id: userId })
        .first();
};

export const updateByUserId = async (userId, data) => {
    return await knex("riders")
        .where({ user_id: userId })
        .update(data)
        .returning("*");
};

export const deleteByUserId = async (userId) => {
    return await knex("riders")
        .where({ user_id: userId })
        .del();
};