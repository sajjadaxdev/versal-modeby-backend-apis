import { RIDE_EN_ROUTE_PICKUP, RIDE_DRIVER_ARRIVED, RIDE_STARTED, } from "../notificationTypes.js";


/*
|--------------------------------------------------------------------------
| Driver Heading To Pickup
|--------------------------------------------------------------------------
*/
export const rideEnRoutePickupTemplate = async ({
    rideId = null,
    driverName = "Your driver",
}) => {

    return {
        title: "Driver is on the way",
        body: `${driverName} is heading to your pickup location.`,

        type: RIDE_EN_ROUTE_PICKUP,

        data: {
            type: RIDE_EN_ROUTE_PICKUP,
            ride_id: rideId ? String(rideId) : "",
            status: "en_route_pickup",
        },
    };
};


/*
|--------------------------------------------------------------------------
| Driver Arrived At Pickup
|--------------------------------------------------------------------------
*/
export const driverArrivedPickupTemplate = async ({
    rideId = null,
    driverName = "Your driver",
}) => {

    return {
        title: "Your driver has arrived",
        body: `${driverName} has arrived at your pickup location.`,

        type: RIDE_DRIVER_ARRIVED,

        data: {
            type: RIDE_DRIVER_ARRIVED,
            ride_id: rideId ? String(rideId) : "",
            status: "arrived_pickup",
        },
    };
};


/*
|--------------------------------------------------------------------------
| Ride Started
|--------------------------------------------------------------------------
*/
export const rideStartedTemplate = async ({
    rideId = null,
    driverName = "Your driver",
}) => {

    return {
        title: "Ride started",
        body: `Your ride with ${driverName} has started. Have a safe journey!`,

        type: RIDE_STARTED,

        data: {
            type: RIDE_STARTED,
            ride_id: rideId ? String(rideId) : "",
            status: "in_progress",
        },
    };
};