import * as ratingRepository from "../repositories/ratingRepository.js";
import {
    AppError
} from "../utils/AppError.js";
import {
    transformRating
} from "../transformers/ratingTransformer.js";

/*
|--------------------------------------------------------------------------
| Create Rating
|--------------------------------------------------------------------------
*/
export const createRating = async (rideId, userId, data) => {

    const ride = await ratingRepository.findRideForRating(rideId);

    if (!ride) {
        throw new AppError("Ride not found.", 404);
    }

    /*
    |--------------------------------------------------------------------------
    | Ride Must Be Completed
    |--------------------------------------------------------------------------
    */

    if (ride.status !== "completed") {
        throw new AppError(
            "Rating is only allowed after ride completion.",
            409
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Determine Rated User
    |--------------------------------------------------------------------------
    */

    let ratedUser = null;
    let raterType = null;

    /*
    |--------------------------------------------------------------------------
    | Rider → Driver
    |--------------------------------------------------------------------------
    */
    if (Number(ride.rider_id) === Number(userId)) {

        if (!ride.driver_id) {
            throw new AppError("This ride does not have an assigned driver.", 409);
        }

        const driver = await ratingRepository.findDriverUser(
            ride.driver_id
        );

        if (!driver || !driver.user_id) {
            throw new AppError("Driver information is unavailable.", 409);
        }

        ratedUser = Number(driver.user_id);
        raterType = "rider";
    }

    /*
    |--------------------------------------------------------------------------
    | Driver → Rider
    |--------------------------------------------------------------------------
    */
    else if (ride.driver_id) {

        const driver = await ratingRepository.findDriverUser(
            ride.driver_id
        );

        if (driver && Number(driver.user_id) === Number(userId)) {

            if (!ride.rider_id) {
                throw new AppError("This ride does not have an assigned rider.", 409);
            }
            ratedUser = Number(ride.rider_id);
            raterType = "driver";
        }

    }

    /*
    |--------------------------------------------------------------------------
    | User Is Not Ride Participant
    |--------------------------------------------------------------------------
    */

    if (!ratedUser) {
        throw new AppError("You are not allowed to rate this ride.", 403);
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent Self Rating
    |--------------------------------------------------------------------------
    */
    if (Number(userId) === Number(ratedUser)) {

        throw new AppError("You cannot rate yourself.", 400);

    }

    /*
    |--------------------------------------------------------------------------
    | Duplicate Rating
    |--------------------------------------------------------------------------
    */
    const existingRating = await ratingRepository.findByRideAndRater(
        rideId,
        userId
    );

    if (existingRating) {
        throw new AppError("You have already rated this ride.", 409);
    }

    /*
    |--------------------------------------------------------------------------
    | Create Rating
    |--------------------------------------------------------------------------
    */
    const rating = await ratingRepository.create({
        ride_id: rideId,
        rated_by: userId,
        rated_user: ratedUser,
        score: data.rating,
        comment: data.comment && data.comment.trim() !== "" ? data.comment.trim() : null,
    });

    return {
        success: true,
        message: raterType === "rider" ? "Driver rating submitted successfully." : "Rider rating submitted successfully.",
        data: transformRating(rating),
    };

};

/*
|--------------------------------------------------------------------------
| Get My Rating For Ride
|--------------------------------------------------------------------------
*/
export const getMyRatingForRide = async (
    rideId,
    userId
) => {

    const ride = await ratingRepository.findRideForRating(
        rideId
    );

    if (!ride) {
        throw new AppError("Ride not found.", 404);
    }

    /*
    |--------------------------------------------------------------------------
    | Verify User Is Participant
    |--------------------------------------------------------------------------
    */

    let isParticipant = false;

    if (Number(ride.rider_id) === Number(userId)) {

        isParticipant = true;

    } else if (ride.driver_id) {

        const driver =
            await ratingRepository.findDriverUser(
                ride.driver_id
            );

        if (
            driver &&
            Number(driver.user_id) === Number(userId)
        ) {
            isParticipant = true;
        }

    }

    if (!isParticipant) {

        throw new AppError(
            "You are not allowed to access this ride rating.",
            403
        );

    }

    const rating =
        await ratingRepository.findByRideAndRater(
            rideId,
            userId
        );

    return {

        success: true,

        message: "Ride rating fetched successfully.",

        data: transformRating(rating),

    };

};