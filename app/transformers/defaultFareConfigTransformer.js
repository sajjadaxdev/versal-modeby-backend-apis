import { formatDateTime } from "../helpers/dateHelper.js";

const mapDefaultFareConfig = (defaultFareConfig = {}) => ({

    id: Number(defaultFareConfig.id),
    name: defaultFareConfig.name,
    vehicle_type_id: defaultFareConfig.vehicle_type_id,
    vehicle_type_name: defaultFareConfig.vehicle_type_name,

    base_fare: defaultFareConfig.base_fare,
    per_km_rate: defaultFareConfig.per_km_rate,
    per_min_rate: defaultFareConfig.per_min_rate,
    minimum_fare: defaultFareConfig.minimum_fare,

    is_active:  Boolean(defaultFareConfig.is_active),
    created_at: formatDateTime(defaultFareConfig.created_at),
    updated_at: formatDateTime(defaultFareConfig.updated_at),

});

export const transformDefaultFareConfig = (defaultFareConfig) => mapDefaultFareConfig(defaultFareConfig);

export const transformDefaultFareConfigs = (DefaultFareConfigs = []) =>
    DefaultFareConfigs.map(mapDefaultFareConfig);