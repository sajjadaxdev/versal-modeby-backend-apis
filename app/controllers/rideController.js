import * as rideService from "../services/rideService.js";

export const getRideOptions = async (req, res, next) => {
    try { 

        return res.json(await rideService.getRideOptions(req.body)); 

    } catch (e) { 
        next(e); 
    }
};

export const requestRide = async (req, res, next) => {
    try {

        const result = await rideService.requestRide(
            req.user.id,
            req.body
        );

        res.json(result);

    } catch (e) {
        next(e);
    }
};

export const findNearestDriver = async (req, res, next) => {

    try {

        const result = await rideService.findNearestDriver(
            req.params.rideId
        );

        return res.json(result);

    } catch (e) {

        next(e);

    }
};

export const getRideStatus = async (req, res, next) => {

    try {

        const result = await rideService.getRideStatus(
            req.params.rideId
        );

        return res.json(result);

    } catch (e) {

        next(e);

    }
};

export const cancelRide = async (req, res, next) => {

    try {

        const result = await rideService.cancelRide(
            req.user.id,
            req.params.rideId,
            req.body.cancel_reason ?? null
        );

        return res.json(result);

    } catch (e) {

        next(e);

    }
};

export const getRideTracking = async (req, res, next) => {
    try {

        const result = await rideService.getRideTracking(
            req.user.id,
            req.params.rideId
        );

        return res.json(result);

    } catch (e) {

        next(e);

    }
};

/*
|--------------------------------------------------------------------------
| Update Ride Status
|--------------------------------------------------------------------------
*/

export const updateRideStatus = async (req, res, next) => {

    try {

        const result = await rideService.updateRideStatus({
            rideId: req.params.rideId,
            userId: req.user.id,
            status: req.body.status,
        });

        return res.json(result);

    } catch (e) {

        next(e);

    }
};
