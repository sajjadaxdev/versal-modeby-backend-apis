import * as turf from "@turf/turf";
import * as cityRepository from "../repositories/cityRepository.js";
import {transformCity, transformCities} from "../transformers/cityTransformer.js";
/*
|--------------------------------------------------------------------------
| Get City By Latitude & Longitude
|--------------------------------------------------------------------------
*/

export const getCityByLatLang = async (latitude, longitude) => {

    const cities = await cityRepository.getActiveCities();

    const point = turf.point([
        Number(longitude),
        Number(latitude),
    ]);

    for (const city of cities) {

        if (!city.geojson) {
            continue;
        }

        try {

            const geometry = typeof city.geojson === "string" ? JSON.parse(city.geojson) : city.geojson;

            const isInside = turf.booleanPointInPolygon(
                point,
                geometry
            );

            if (isInside) {
                return transformCity(city);
            }

        } catch (error) {

            console.error(
                `Invalid GeoJSON for city ID ${city.id}`,
                error.message
            );

        }

    }

    return null;

};