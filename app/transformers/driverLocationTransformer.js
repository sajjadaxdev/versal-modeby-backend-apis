export const driverLocationTransformer = (
    location
) => {

    if (!location) return null;

    return {
        id: location.id,
        driver_id: location.driver_id,
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
        heading: location.heading,
        speed: Number(location.speed || 0),
        last_update: location.last_update,
    };
};