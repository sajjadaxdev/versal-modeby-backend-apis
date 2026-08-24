import * as service from "../services/defaultSurgePricingService.js";

export const index = async (req, res, next) => {
    try { return res.json(await service.getSurgePricings(req.query)); }
    catch (e) { next(e); }
};

export const show = async (req, res, next) => {
    try { return res.json(await service.getSurgePricingById(req.params.id)); }
    catch (e) { next(e); }
};

export const store = async (req, res, next) => {
    try { return res.json(await service.createSurgePricing(req.body)); }
    catch (e) { next(e); }
};

export const update = async (req, res, next) => {
    try { return res.json(await service.updateSurgePricing(req.params.id, req.body)); }
    catch (e) { next(e); }
};

export const destroy = async (req, res, next) => {
    try { return res.json(await service.deleteSurgePricing(req.params.id)); }
    catch (e) { next(e); }
};

export const getActiveSurge = async (req, res, next) => {
    try {
        const { vehicle_type_id, time } = req.query;
        return res.json(await service.getActiveSurgeByTime(vehicle_type_id, time));
    }
    catch (e) { next(e); }
};