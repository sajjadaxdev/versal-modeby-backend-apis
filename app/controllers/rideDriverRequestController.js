import * as rideDriverRequestService from "../services/rideDriverRequestService.js";


export const getPendingRequests = async (req, res, next) => {

    try {

        const result = await rideDriverRequestService.getPendingRequests(req.user.id);

        return res.json(result);

    } catch (e) {

        next(e);

    }
};

/*
|--------------------------------------------------------------------------
| Accept / Reject Ride Request
|--------------------------------------------------------------------------
*/

export const respondToRequest = async (req, res, next) => {

    try {

        const result = await rideDriverRequestService.respondToRequest(
            req.user.id,
            req.params.requestId,
            req.body.status
        );

        return res.json(result);

    } catch (e) {

        next(e);

    }
};