import { formatDateTime, formatTimeOnly12 } from "../helpers/dateHelper.js";

const mapSurge = (surge = {}) => ({
    id:                   Number(surge.id),
    city_id:              surge.city_id,
    city_name:            surge.city_name,
    vehicle_type_id:      surge.vehicle_type_id,
    vehicle_type_name:    surge.vehicle_type_name,
    multiplier:           surge.multiplier,
    start_time:           surge.start_time,
    end_time:             surge.end_time,
    start_time_formatted: formatTimeOnly12(surge.start_time),
    end_time_formatted:   formatTimeOnly12(surge.end_time),
    is_active:            Boolean(surge.is_active),
    created_at:           formatDateTime(surge.created_at),
    updated_at:           formatDateTime(surge.updated_at),
});

export const transformSurge  = (surge)        => mapSurge(surge);
export const transformSurges = (surges = [])  => surges.map(mapSurge);