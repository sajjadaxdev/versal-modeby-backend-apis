import { AppError } from "../utils/AppError.js";

import { findById as findUserById } from "../repositories/userRepository.js";
import { existsByIds } from "../repositories/roleRepository.js";

import { findRolesByUser, getRoleIdsByUser, assign, sync, remove } from "../repositories/userRoleRepository.js";

export const getUserRoles = async (userId) => {

    const user = await findUserById(userId);

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    const roles = await findRolesByUser(userId);

    return {
        success: true,
        data: roles,
    };
};

export const assignUserRoles = async (userId, roles) => {

    const user = await findUserById(userId);

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    const validRoles = await existsByIds(roles);

    if (validRoles.length !== roles.length) {
        throw new AppError("One or more roles are invalid.", 400);
    }

    const existing = await getRoleIdsByUser(userId);

    const existingIds = existing.map(r => r.role_id);

    const newRoles = roles.filter(id => !existingIds.includes(id));

    if (newRoles.length > 0) {
        await assign(userId, newRoles);
    }

    return {
        success: true,
        message: "Roles assigned successfully.",
    };
};

export const syncUserRoles = async (userId, roles) => {

    const user = await findUserById(userId);

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    const validRoles = await existsByIds(roles);

    if (validRoles.length !== roles.length) {
        throw new AppError("One or more roles are invalid.", 400);
    }

    await sync(userId, roles);

    return {
        success: true,
        message: "Roles updated successfully.",
    };
};

export const removeUserRole = async (userId, roleId) => {

    const user = await findUserById(userId);

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    await remove(userId, roleId);

    return {
        success: true,
        message: "Role removed successfully.",
    };
};