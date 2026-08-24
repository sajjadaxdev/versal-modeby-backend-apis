import { formatDateTime } from "../helpers/dateHelper.js";

const mapVehicle = (vehicle = {}) => ({

    id: Number(vehicle.id),
    driver_id: vehicle.driver_id ? Number(vehicle.driver_id) : null,

    owner_id: vehicle.owner_id,
    owner_name: vehicle.owner_name,
    owner_type: vehicle.owner_type,

    vehicle_type_id: Number(vehicle.vehicle_type_id),
    make: vehicle.make,
    model: vehicle.model,
    year: Number(vehicle.year),
    color: vehicle.color,
    registration_number: vehicle.registration_number,
    vehicle_image: vehicle.vehicle_image,
    vehicle_image_full: vehicle.vehicle_image_full,
    vehicle_type_name: vehicle.vehicle_type_name,
    driver_name: vehicle.driver_name,

    allow_city_ride: vehicle.allow_city_ride,
    allow_intercity_ride: vehicle.allow_intercity_ride,
    is_verified: Boolean(vehicle.is_verified),
    is_active: Boolean(vehicle.is_active),
    created_at: formatDateTime(vehicle.created_at),
    updated_at: formatDateTime(vehicle.updated_at),

});

export const transformVehicle = (vehicle) => mapVehicle(vehicle);

export const transformVehicles = (vehicles = []) => vehicles.map(mapVehicle);