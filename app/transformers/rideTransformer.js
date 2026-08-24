export const rideRequestTransformer = (ride) => {

    return {
        ride_id: Number(ride.id),
        status: ride.status,
    };

};