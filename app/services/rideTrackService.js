import * as rideTrackRepo from "../repositories/rideTrackRepository.js";
import * as driverRepo from "../repositories/driverRepository.js";

import { calculateDistanceMeters } from "../helpers/commonHelper.js";


/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

const MIN_TRACK_DISTANCE_METERS = 10;


/*
|--------------------------------------------------------------------------
| RECORD RIDE TRACK
|--------------------------------------------------------------------------
|
| Records driver location against the driver's active ride.
|
| A new track is inserted only when the driver has moved at least
| MIN_TRACK_DISTANCE_METERS from the previous recorded track.
|
*/
export const recordTrack = async (
    driverId,
    data
) => {

    /*
    |--------------------------------------------------------------------------
    | Check Active Ride
    |--------------------------------------------------------------------------
    */
    const activeRide = await driverRepo.getActiveRideByDriverId(driverId);

    /*
    |--------------------------------------------------------------------------
    | No Active Ride
    |--------------------------------------------------------------------------
    |
    | Driver may be online without having an active ride.
    |
    */
    if (!activeRide)
        return null;


    /*
    |--------------------------------------------------------------------------
    | Get Latest Track
    |--------------------------------------------------------------------------
    */
    const latestTrack = await rideTrackRepo.getLatestByRideId(activeRide.id);


    /*
    |--------------------------------------------------------------------------
    | Check Distance
    |--------------------------------------------------------------------------
    */
    if (latestTrack) {

        const distanceMeters = calculateDistanceMeters(
            Number(latestTrack.latitude),
            Number(latestTrack.longitude),
            Number(data.latitude),
            Number(data.longitude)
        );


        /*
        |--------------------------------------------------------------------------
        | Driver Has Not Moved Enough
        |--------------------------------------------------------------------------
        |
        | Do not create another record.
        |
        */
        if (distanceMeters < MIN_TRACK_DISTANCE_METERS) {

            return {
                recorded: false,
                reason: "minimum_distance_not_reached",
                distance_meters: distanceMeters,
                ride_id: activeRide.id,
            };

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Create Ride Track
    |--------------------------------------------------------------------------
    */
    const heading = data.heading != null
        ? Math.round(Number(data.heading))
        : null;


    const track = await rideTrackRepo.create({
        ride_id: activeRide.id,
        latitude: data.latitude,
        longitude: data.longitude,
        heading,
        speed: data.speed,
    });


    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return {
        recorded: true,
        ride_id: activeRide.id,
        track,
    };
};