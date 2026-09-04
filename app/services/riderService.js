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

/*
|--------------------------------------------------------------------------
| Rider Session Recovery
|--------------------------------------------------------------------------
*/

const getRiderNextAction = (ride) => {

    if (!ride) {
        return "rider_home";
    }

    switch (ride.status) {

        case "requested":
            return "searching_driver";

        case "accepted":
        case "en_route_pickup":
        case "arrived_pickup":
            return "waiting_for_driver";

        case "in_progress":
            return "rider_ride_tracking";

        default:
            return "rider_home";
    }
};


export const getSession = async (userId) => {

    /*
    |--------------------------------------------------------------------------
    | Find Rider Profile
    |--------------------------------------------------------------------------
    */

    const rider = await riderRepo.findByUserId(userId);

    if (!rider) {
        throw new AppError("Rider not found.", 404);
    }


    /*
    |--------------------------------------------------------------------------
    | Find Active Ride
    |--------------------------------------------------------------------------
    */

    const ride = await riderRepo.getActiveRideByRiderId(userId);


    /*
    |--------------------------------------------------------------------------
    | Determine Next Action
    |--------------------------------------------------------------------------
    */

    const nextAction = getRiderNextAction(ride);


    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return {
        success: true,
        message: "Rider session fetched successfully.",

        data: {
            role: "rider",

            hasActiveRide: Boolean(ride),

            nextAction,

            ride: ride
                ? {
                    id: ride.id,
                    status: ride.status,

                    riderId: ride.rider_id,
                    driverId: ride.driver_id,

                    pickupAddress: ride.pickup_address,
                    pickupLat: ride.pickup_lat,
                    pickupLng: ride.pickup_lng,

                    dropAddress: ride.drop_address,
                    dropLat: ride.drop_lat,
                    dropLng: ride.drop_lng,

                    distanceKm: ride.distance_km,
                    durationMinutes: ride.duration_minutes,

                    fareEstimate: ride.fare_estimate,
                    fareFinal: ride.fare_final,

                    driver: ride.driver_id
                        ? {
                            id: ride.driver_id,
                            firstName: ride.driver_first_name,
                            lastName: ride.driver_last_name,
                            username: ride.driver_username,
                            phone: ride.driver_phone,
                            avatar: ride.driver_avatar,
                            rating: ride.driver_rating,
                            personalPicture: ride.driver_personal_picture,
                        }
                        : null,

                    vehicle: ride.vehicle_id
                        ? {
                            id: ride.vehicle_id,
                            make: ride.vehicle_make,
                            model: ride.vehicle_model,
                            year: ride.vehicle_year,
                            color: ride.vehicle_color,
                            registrationNumber: ride.vehicle_registration_number,
                            image: ride.vehicle_image,
                        }
                        : null,

                    vehicleType: {
                        id: ride.vehicle_type_id,
                        name: ride.vehicle_type_name,
                        slug: ride.vehicle_type_slug,
                        icon: ride.vehicle_type_icon,
                        mapIcon: ride.vehicle_type_map_icon,
                        seatingCapacity: ride.vehicle_type_seating_capacity,
                    },

                    createdAt: ride.created_at,
                    updatedAt: ride.updated_at,
                }
                : null,
        },
    };
};