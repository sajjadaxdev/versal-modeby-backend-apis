import * as riderService from "../services/riderService.js";

export const create = async (req, res, next) => {
    try {
        const result = await riderService.create(req.body);
        res.json(result);
    } catch (e) {
        next(e);
    }
};

export const profile = async (req, res, next) => {
    try {
        const result = await riderService.profile(req.body.user_id);
        res.json(result);
    } catch (e) {
        next(e);
    }
};

export const update = async (req, res, next) => {
    try {
        const result = await riderService.update(req.body);
        res.json(result);
    } catch (e) {
        next(e);
    }
};

export const remove = async (req, res, next) => {
    try {
        const result = await riderService.remove(req.body.user_id);
        res.json(result);
    } catch (e) {
        next(e);
    }
};