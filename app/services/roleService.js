import * as roleRepository from "../repositories/roleRepository.js";
import { AppError } from "../utils/AppError.js";

export const getRoles = async (filters) => {

    const result = await roleRepository.findAll(filters);

    return {
        success: true,
        message: "Roles fetched successfully",
        data: result.rows,
        totalPermissions: result.totalPermissions,
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / result.limit),
        },
    };

};

export const getRole = async (id) => {

    const role = await roleRepository.findById(id);

    if(!role)
        throw new AppError("Role not found.", 400);

    return {
        success: true,
        message: "Role fetched successfully",
        data: role,
    };

};

export const createRole = async (data) => {

    const exists = await roleRepository.findByName(data.name);

    if (exists) {
        throw new AppError("Role already exists.", 400);
    }

    const role = await roleRepository.create(data);

    return {
        success: true,
        message: "Role created successfully",
        data: role,
    };

};

export const updateRole = async (id, data) => {

    const role = await roleRepository.findById(id);

    if (!role) {
        throw new AppError("Role not found.", 404);
    }

    const oldRole = await roleRepository.findByName(data.name);

    if (oldRole && oldRole.id != id) {
        throw new AppError("Role already exists.", 400);
    }


    const updatedRole = await roleRepository.update(id, data);

    return {
        success: true,
        message: "Role updated successfully",
        data: updatedRole,
    };

};

export const deleteRole = async (id) => {

    const role = await roleRepository.findById(id);

    if (!role) {
        throw new AppError("Role not found.", 404);
    }

    await roleRepository.remove(id);

    return {
        success: true,
        message: "Role deleted successfully",
    };

};