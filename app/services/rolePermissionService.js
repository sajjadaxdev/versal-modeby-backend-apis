import * as repository from "../repositories/rolePermissionRepository.js";
import {findById as roleFindById}  from "../repositories/roleRepository.js";
import {findIds as permissionFindIds}  from "../repositories/permissionRepository.js";
import { AppError } from "../utils/AppError.js";

export const getRolePermissions = async (roleId) => {

    const permissions = await repository.getPermissions(roleId);

    return {
        success: true,
        message: "Role permissions fetched successfully",
        data: permissions,
    };

};

export const syncRolePermissions = async (roleId, permissions) => {

    const role = await roleFindById(roleId);

    if (!role) {
        throw new AppError("Role not found.", 404);
    }

    const validPermissions = await permissionFindIds(permissions);

    if (validPermissions.length !== permissions.length) {
        const invalidIds = permissions.filter(id => !validPermissions.includes(id));
        throw new AppError(`Invalid permission id(s): ${invalidIds.join(", ")}`, 400);
    }

    await repository.sync(roleId, permissions);

    return {
        success: true,
        message: "Role permissions updated successfully",
    };

};

export const removeRolePermission = async (roleId, permissionId) => {

    await repository.remove(roleId, permissionId);

    return {
        success: true,
        message: "Permission removed successfully",
    };

};