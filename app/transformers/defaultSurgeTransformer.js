import { formatDateTime, formatTimeOnly12 } from "../helpers/dateHelper.js";

const mapDefaultSurge = (defaultSurge = {}) => ({

    id: Number(defaultSurge.id),

    vehicle_type_id: defaultSurge.vehicle_type_id,
    vehicle_type_name: defaultSurge.vehicle_type_name,
    multiplier: defaultSurge.multiplier,

    start_time: defaultSurge.start_time,
    end_time: defaultSurge.end_time,

    start_time_formatted: formatTimeOnly12(defaultSurge.start_time),
    end_time_formatted: formatTimeOnly12(defaultSurge.end_time),

    is_active:  Boolean(defaultSurge.is_active),
    created_at: formatDateTime(defaultSurge.created_at),
    updated_at: formatDateTime(defaultSurge.updated_at),

});

export const transformDefaultSurge = (defaultSurge) => mapDefaultSurge(defaultSurge);

export const transformDefaultSurges = (DefaultSurges = []) =>
    DefaultSurges.map(mapDefaultSurge);