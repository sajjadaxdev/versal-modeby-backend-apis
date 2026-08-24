import { formatDateTime } from "../helpers/dateHelper.js";

const mapData = (row = {}) => ({

    id: row.id,
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    is_active: Boolean(row.is_active),

});

export const transformCity = (row) => mapData(row);

export const transformCities = (rows = []) => rows.map(mapData);