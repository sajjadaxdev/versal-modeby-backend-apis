import * as permissionRepository from "../repositories/permissionRepository.js";
import { AppError } from "../utils/AppError.js";

export const getPermissions = async (filters) => {

    const result = await permissionRepository.findAll(filters);

    return {
        success: true,
        message: "Permissions fetched successfully",
        data: result.rows,
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / result.limit),
        },
    };

};

export const getPermission = async (id) => {

    const role = await permissionRepository.findById(id);

    if(!role)
        throw new AppError("Permission not found.", 400);

    return {
        success: true,
        message: "Permission fetched successfully",
        data: role,
    };

};

export const createPermission = async (data) => {

    const exists = await permissionRepository.findByName(data.name);

    if (exists) {
        throw new AppError("Permission already exists.", 400);
    }

    const role = await permissionRepository.create(data);

    return {
        success: true,
        message: "Permission created successfully",
        data: role,
    };

};

export const updatePermission = async (id, data) => {

    const role = await permissionRepository.findById(id);

    if (!role) {
        throw new AppError("Permission not found.", 404);
    }

    const oldRole = await permissionRepository.findByName(data.name);

    if (oldRole && oldRole.id != id) {
        throw new AppError("Permission already exists.", 400);
    }


    const updatedRole = await permissionRepository.update(id, data);

    return {
        success: true,
        message: "Permission updated successfully",
        data: updatedRole,
    };

};

export const deletePermission = async (id) => {

    const role = await permissionRepository.findById(id);

    if (!role) {
        throw new AppError("Permission not found.", 404);
    }

    await permissionRepository.remove(id);

    return {
        success: true,
        message: "Permission deleted successfully",
    };

};