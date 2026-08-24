import * as riderRepo from "../repositories/riderRepository.js";
import { riderTransformer } from "../transformers/riderTransformer.js";
import { AppError } from "../utils/AppError.js";

export const create = async (data) => {

    const existing = await riderRepo.findByUserId(data.user_id);

    if (existing) {
        throw new AppError("Rider profile already exists.", 409);
    }

    const rider = await riderRepo.create({
        user_id: data.user_id,
        preferred_payment: data.preferred_payment,
    });

    return {
        success: true,
        message: "Rider created successfully.",
        data: riderTransformer(rider),
    };
};

export const profile = async (userId) => {

    const rider = await riderRepo.findByUserId(userId);

    if (!rider) {
        throw new AppError("Rider not found.", 404);
    }

    return {
        success: true,
        message: "Rider fetched successfully.",
        data: riderTransformer(rider),
    };
};

export const update = async (data) => {

    const rider = await riderRepo.findByUserId(data.user_id);

    if (!rider) {
        throw new AppError("Rider not found.", 404);
    }

    const updated = await riderRepo.updateByUserId(data.user_id, {
        preferred_payment: data.preferred_payment,
    });

    return {
        success: true,
        message: "Rider updated successfully.",
        data: riderTransformer(updated),
    };
};

export const remove = async (userId) => {

    const rider = await riderRepo.findByUserId(userId);

    if (!rider) {
        throw new AppError("Rider not found.", 404);
    }

    await riderRepo.deleteByUserId(userId);

    return {
        success: true,
        message: "Rider deleted successfully.",
    };
};