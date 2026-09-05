import knex from "../../db/knex.js";

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
*/

export const create = async ({
    userId,
    type,
    title,
    body,
    data = {},
}) => {

    const [notification] = await knex("notifications")
        .insert({
            user_id: userId,
            type,
            title,
            body,
            data,
            is_read: false,
        })
        .returning("*");

    return notification;
};


/*
|--------------------------------------------------------------------------
| Find User Notifications
|--------------------------------------------------------------------------
*/

export const findByUser = async (userId, filters = {}) => {

    const page = Number(filters.page ?? 1);
    const limit = Number(filters.limit ?? 10);
    
    const offset = (page - 1) * limit;

    const rows = await knex("notifications")
        .where("user_id", userId)
        .orderBy("is_read", "asc")
        .orderBy("created_at", "desc")
        .limit(limit)
        .offset(offset);

    const result = await knex("notifications")
        .where("user_id", userId)
        .count("id as count")
        .first();

    const total = Number(result?.count || 0);

    return {
        rows,
        total,
        page,
        limit,
    };
};


/*
|--------------------------------------------------------------------------
| Find Notification
|--------------------------------------------------------------------------
*/

export const findById = async ({
    userId,
    notificationId,
}) => {

    return await knex("notifications")
        .where({
            id: notificationId,
            user_id: userId,
        })
        .first();
};


/*
|--------------------------------------------------------------------------
| Mark Notification As Read
|--------------------------------------------------------------------------
*/

export const markAsRead = async ({
    userId,
    notificationId,
}) => {

    const [notification] = await knex("notifications")
        .where({
            id: notificationId,
            user_id: userId,
        })
        .update({
            is_read: true,
            read_at: knex.fn.now(),
            updated_at: knex.fn.now(),
        })
        .returning("*");

    return notification;
};


/*
|--------------------------------------------------------------------------
| Mark All Notifications As Read
|--------------------------------------------------------------------------
*/

export const markAllAsRead = async (userId) => {

    return await knex("notifications")
        .where({
            user_id: userId,
            is_read: false,
        })
        .update({
            is_read: true,
            read_at: knex.fn.now(),
            updated_at: knex.fn.now(),
        });
};


/*
|--------------------------------------------------------------------------
| Unread Count
|--------------------------------------------------------------------------
*/

export const unreadCount = async (userId) => {

    const result = await knex("notifications")
        .where({
            user_id: userId,
            is_read: false,
        })
        .count("id as count")
        .first();

    return Number(result?.count || 0);
};