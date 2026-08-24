import * as currencyService from "../services/currencyConfigService.js";

export const index   = async (req, res, next) => {
    try { 
        return res.json(await currencyService.getCurrencies(req.query)); 
    } catch (e) { 
        next(e); 
    }
};

export const show    = async (req, res, next) => {
    try { 
        return res.json(await currencyService.getCurrencyById(req.params.id)); 
    }
    catch (e) { 
        next(e); 
    }
};

export const store   = async (req, res, next) => {
    try { 
        return res.json(await currencyService.createCurrency(req.body)); 
    } catch (e) { 
        next(e); 
    }
};

export const update  = async (req, res, next) => {
    try { 
        return res.json(await currencyService.updateCurrency(req.params.id, req.body)); 
    }catch (e) { 
        next(e); 
    }
};

export const destroy = async (req, res, next) => {
    try { 
        return res.json(await currencyService.deleteCurrency(req.params.id)); 
    } catch (e) { 
        next(e); 
    }
};

export const getActive = async (req, res, next) => {
    try { return res.json(await currencyService.getActiveCurrency()); }
    catch (e) { next(e); }
};