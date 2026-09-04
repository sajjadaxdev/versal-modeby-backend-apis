import * as ratingService from "../services/ratingService.js";

/*
|--------------------------------------------------------------------------
| Create Rating
|--------------------------------------------------------------------------
*/
export const store = async (req, res, next) => {

    try {

        const response = await ratingService.createRating(
            req.params.rideId,
            req.user.id,
            req.body
        );

        return res.status(201).json(response);

    } catch (error) {

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| Get My Rating For Ride
|--------------------------------------------------------------------------
*/
export const show = async (req, res, next) => {

    try {

        const response = await ratingService.getMyRatingForRide(
            req.params.rideId,
            req.user.id
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }

};