import * as repo from "../repositories/defaultSurgePricingRepository.js";
import { AppError } from "../utils/AppError.js";
import {transformDefaultSurges, transformDefaultSurge} from "../transformers/defaultSurgeTransformer.js";

export const getSurgePricings = async (filters) => {
    const result = await repo.findAll(filters);
    return {
        success: true,
        message: "Default surge pricings fetched successfully.",
        data: transformDefaultSurges(result.rows),
        pagination: {
            page:       result.page,
            limit:      result.limit,
            total:      result.total,
            totalPages: Math.ceil(result.total / result.limit),
        },
    };
};

export const getSurgePricingById = async (id) => {
    const record = await repo.findById(id);
    if (!record) throw new AppError("Surge pricing not found.", 404);
    return {
        success: true,
        message: "Surge pricing fetched successfully.",
        data: transformDefaultSurge(record),
    };
};

export const getActiveSurgeByTime = async (vehicle_type_id, time) => {
    const record = await repo.findActiveByTime(vehicle_type_id, time);
    return {
        success: true,
        message: record ? "Active surge found." : "No active surge for this time.",
        data: record || null,
    };
};

export const createSurgePricing = async (data) => {
    if (!data.multiplier || data.multiplier < 1) {
        throw new AppError("Multiplier must be 1 or greater.", 400);
    }

    if (data.start_time >= data.end_time) {
        throw new AppError("Start time must be before end time.", 400);
    }

    const record = await repo.create(data);
    return {
        success: true,
        message: "Surge pricing created successfully.",
        data: record,
    };
};

export const updateSurgePricing = async (id, data) => {
    const exists = await repo.findById(id);
    if (!exists) throw new AppError("Surge pricing not found.", 404);

    if (data.multiplier && data.multiplier < 1) {
        throw new AppError("Multiplier must be 1 or greater.", 400);
    }

    if (data.start_time && data.end_time && data.start_time >= data.end_time) {
        throw new AppError("Start time must be before end time.", 400);
    }

    const updated = await repo.update(id, data);
    return {
        success: true,
        message: "Surge pricing updated successfully.",
        data: updated,
    };
};

export const deleteSurgePricing = async (id) => {
    const exists = await repo.findById(id);
    if (!exists) throw new AppError("Surge pricing not found.", 404);

    await repo.remove(id);
    return {
        success: true,
        message: "Surge pricing deleted successfully.",
    };
};