import { formatDateTime } from "../helpers/dateHelper.js";

const mapVehicleType = (vehicleType = {}) => ({

    id: vehicleType.id,
    name: vehicleType.name,
    slug: vehicleType.slug,
    icon: vehicleType.icon,

    allow_city_ride: vehicleType.allow_city_ride,
    allow_intercity_ride: vehicleType.allow_intercity_ride,

    iconFull: vehicleType.iconFull,
    seating_capacity: vehicleType.seating_capacity,
    display_order: vehicleType.display_order,
    description: vehicleType.description,
    vehicles_count: Number(vehicleType.vehicles_count || 0),
    is_active: Boolean(vehicleType.is_active),

    created_at: formatDateTime(vehicleType.created_at),
    updated_at: formatDateTime(vehicleType.updated_at),

});

export const transformVehicleType = (vehicleType) => mapVehicleType(vehicleType);
export const transformVehicleTypes = (vehicleTypes = []) => vehicleTypes.map(mapVehicleType);