import { APP_TIMEZONE } from "../../config/app.js"
import {
    formatDatabaseDateTime,
    diffInSeconds,
    now,
} from "../helpers/dateHelper.js";

const mapData = (record = {}) => ({

    request_id: record.request_id,
    ride_id: record.ride_id,
    status: record.status,

    requested_at: formatDatabaseDateTime(record.requested_at),
    responded_at: formatDatabaseDateTime(record.responded_at),
    expires_at: formatDatabaseDateTime(record.expires_at),
    expires_in_seconds: getExpiresInSeconds(record.expires_at),
    pickup_address: record.pickup_address,
    pickup_lat: record.pickup_lat,
    pickup_lng: record.pickup_lng,

    drop_address: record.drop_address,
    drop_lat: record.drop_lat,
    drop_lng: record.drop_lng,

    distance_km: record.distance_km,
    duration_minutes: record.duration_minutes,
    fare_estimate: record.fare_estimate,

    vehicle_type_id: record.vehicle_type_id

});

export const transformRideDriverRequest = (record) => mapData(record);

export const transformDriverRequests = (records = []) => records.map(mapData);

const getExpiresInSeconds = (expiresAt) => {

    if (!expiresAt) {
        return 0;
    }

    const seconds = diffInSeconds(
        now(),
        expiresAt
    );

    return Math.max(0, seconds);
};