import * as repo from "../repositories/currencyConfigRepository.js";
import { AppError } from "../utils/AppError.js";

export const getCurrencies = async (filters) => {
    const result = await repo.findAll(filters);
    return {
        success: true,
        message: "Currencies fetched successfully.",
        data: result.rows,
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / result.limit),
        },
    };
};

export const getCurrencyById = async (id) => {
    const currency = await repo.findById(id);
    if (!currency) throw new AppError("Currency not found.", 404);
    return { success: true, message: "Currency fetched successfully.", data: currency };
};

export const createCurrency = async (data) => {
    const exists = await repo.findByCode(data.code);
    if (exists) throw new AppError("Currency code already exists.", 400);

    if (data.is_active) await repo.clearActive();
    
    if (data.is_default) await repo.clearDefault();

    const currency = await repo.create(data);
    return { success: true, message: "Currency created successfully.", data: currency };
};

export const updateCurrency = async (id, data) => {
    const currency = await repo.findById(id);
    if (!currency) throw new AppError("Currency not found.", 404);

    if (data.code) {
        const exists = await repo.findByCode(data.code);
        if (exists && exists.id != id) throw new AppError("Currency code already exists.", 409);
    }
    if (data.is_active) await repo.clearActive(id);
    if (data.is_default) await repo.clearDefault();

    const updated = await repo.update(id, data);
    return { success: true, message: "Currency updated successfully.", data: updated };
};

export const deleteCurrency = async (id) => {
    const currency = await repo.findById(id);
    if (!currency) throw new AppError("Currency not found.", 404);
    if (currency.is_default) throw new AppError("Cannot delete default currency.", 400);

    await repo.remove(id);
    return { success: true, message: "Currency deleted successfully." };
};

export const getActiveCurrency = async () => {
    let currency = await repo.findActive();
    
    if (!currency) {
        currency = await repo.findDefault();
    }

    if (!currency) throw new AppError("No currency configured.", 404);

    return { 
        success: true, 
        message: "Currency fetched successfully.", 
        data: currency 
    };
};