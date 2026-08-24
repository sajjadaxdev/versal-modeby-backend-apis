import * as userRepository from "../repositories/userRepository.js";
import {transformUsers} from '../transformers/userTransformer.js';

export const getUsers = async (filters) => {

    const result = await userRepository.getUsers(filters);

    return {

        success: true,
        message: "Users fetched successfully",
        data: transformUsers(result.rows),
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / result.limit),
        },

    };

};

export const updateUserFcmToken = async (user_id, fcm_token) => {

    await userRepository.updateUserFcmToken(user_id, fcm_token);

    return {
        success: true,
        message: "Users fcm updated successfully",
    };

};
