import knex from "../../db/knex.js"; 
import { AppError } from "../utils/AppError.js";

export const findByUsername = async (username) => {
    return await knex("users").where({ username }).first();
};

export const findByPhone = async (phone) => {

    return await knex("users").where({ phone }).first();

};

export const create = async (data) => {
    
    const allowedColumns = [
        'franchise_id',
        'username',
        'phone',
        'email',
        'password',
        'avatar',
        'fcm_id',
        'google_id',
        'is_active',
        'otp_code',
        'otp_expires_at'
    ];

    const insertData = {};
    for (const key of allowedColumns) {
        if (data[key] !== undefined) {
            insertData[key] = data[key];
        }
    }

    // Insert karo
    const [user] = await knex("users")
        .insert(insertData)
        .returning("*");

    return {
        success: true,
        message: "User registered successfully",
        user
    };
};

export const createOld = async (data) => {

    const [user] = await knex("users")
    .insert({
        phone: data.phone,
        fcm_id: data.fcm_id
    })
    .returning("*");

    return {
        success: true,
        message: "User registered successfully",
        user
    };
};

export const getOrCreate = async (data) => {

    const { phone, fcmToken } = data;

    let user = await findByPhone(phone);
    let isNewUser = false;
    
    if (!user) {

        let createUser = await create({
            phone,
            fcm_id: fcmToken
        });

        if (!createUser.success) {
            throw new AppError("Unable to register, Please try again.", 400);
        }

        isNewUser = true;
        user = createUser.user;
    }else {
        await updateUserFcmToken(user.id, fcmToken);
    }

    return {
        success: true,
        message: "",
        isNewUser,
        user
    };
};

export const updateOtp = async (userId, otp) => {

    return await knex("users").where({ id: userId }).update({
        otp_code: otp,
        otp_expires_at: otp ? knex.fn.now() : null,
        updated_at: knex.fn.now()
    });

};


export const findById = async (id) => {
  return await knex("users").where({ id }).first();
};

export const updateUsername = async (id, name) => {
  return await knex("users")
    .where({ id })
    .update({
      username: name,
      updated_at: knex.fn.now(),
    });
};

export const findByEmail = async (email) => {
  return await knex("users").where({ email }).first();
};

export const createGoogleUser = async (data) => {

  const [user] = await knex("users").insert({
      fcm_id: data.fcm_id,
      username: data.name,
      email: data.email,
      google_id: data.googleId,
      avatar: data.avatar,
    })
    .returning("*");

  return user;
};

export const getUsers = async (filters) => {

    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 10);
    const search = filters.search || "";

    const query = knex("users")
        .leftJoin("user_roles", "users.id", "user_roles.user_id")
        .leftJoin("roles", "user_roles.role_id", "roles.id")
        .leftJoin("franchises", "users.franchise_id", "franchises.id")
        .select(
            "users.*",
            "franchises.name AS franchises_name",
            knex.raw(`
                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', roles.id,
                            'name', roles.name,
                            'slug', roles.slug
                        )
                    ) FILTER (WHERE roles.id IS NOT NULL),
                    '[]'
                ) as roles
            `)
        )
        .groupBy("users.id", 'franchises.name');

    if (search) {

        const normalizedSearch = search.replace(/[\s_-]+/g, "").toLowerCase();

        query.where(function () {
            this.whereRaw(`LOWER(regexp_replace(users.username, '[\\s_-]+', '', 'g')) LIKE ?`, [`%${normalizedSearch}%`])
            .orWhere("users.phone", "like", `%${search}%`)
            .orWhere("users.email", "like", `%${search}%`);
        });
    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        query.where("users.is_active", Number(filters.is_active));
    }

    const totalQuery = knex("users");

    if (search) {
        totalQuery.where(function () {
            this.where("username", "like", `%${search}%`)
                .orWhere("phone", "like", `%${search}%`)
                .orWhere("email", "like", `%${search}%`);
        });
    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        totalQuery.where("is_active", Number(filters.is_active));
    }

    const total = await totalQuery.count("* as count").first();

    const rows = await query
        .orderBy("users.id", "DESC")
        .limit(limit)
        .offset((page - 1) * limit);

    return {
        rows,
        total: Number(total.count),
        page,
        limit,
    };

};


export const updateUserFcmToken = async (userId, token) => {

    if (!token) {
        throw new AppError("FCM token is required.", 400);
    }

    await knex("users")
        .where("id", userId)
        .update({
            fcm_id: token,
            updated_at: knex.fn.now(),
        });

    return true;
};