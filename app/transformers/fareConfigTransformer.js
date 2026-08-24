import { formatDateTime } from "../helpers/dateHelper.js";

const mapFareConfig = (fareConfig = {}) => ({

    id: Number(fareConfig.id),
    name: fareConfig.name,
    city_id: fareConfig.city_id,
    city_name: fareConfig.city_name,
    vehicle_type_id: fareConfig.vehicle_type_id,
    vehicle_type_name: fareConfig.vehicle_type_name,

    base_fare: fareConfig.base_fare,
    per_km_rate: fareConfig.per_km_rate,
    per_min_rate: fareConfig.per_min_rate,
    minimum_fare: fareConfig.minimum_fare,

    is_active:  Boolean(fareConfig.is_active),
    created_at: formatDateTime(fareConfig.created_at),
    updated_at: formatDateTime(fareConfig.updated_at),

});

export const transformFareConfig = (fareConfig) => mapFareConfig(fareConfig);

export const transformFareConfigs = (fareConfigs = []) =>
    fareConfigs.map(mapFareConfig);