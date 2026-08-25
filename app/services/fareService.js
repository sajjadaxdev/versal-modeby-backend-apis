import * as defaultFareConfigRepo from "../repositories/defaultFareConfigRepository.js";
import * as defaultSurgePricingRepo from "../repositories/defaultSurgePricingRepository.js";
import * as currencyService from "./currencyConfigService.js";
import { formatCurrency } from "../helpers/commonHelper.js";


/*
|--------------------------------------------------------------------------
| Get Active Surge Pricing
|--------------------------------------------------------------------------
*/
const getActiveSurge = (
    surgePricings,
    vehicleTypeId,
    currentTime
) => {

    return surgePricings.find(item => {
        if (Number(item.vehicle_type_id) !== Number(vehicleTypeId)) {
            return false;
        }
        return (item.start_time <= currentTime && item.end_time >= currentTime);
    });
};


/*
|--------------------------------------------------------------------------
| Calculate Fare
|--------------------------------------------------------------------------
*/
export const calculateFare = async ({
    vehicleTypeId,
    distanceKm = 0,
    durationMinutes = 0,
}) => {

    /*
    |--------------------------------------------------------------------------
    | Validate Vehicle Type
    |--------------------------------------------------------------------------
    */
    const parsedVehicleTypeId = Number(vehicleTypeId);

    if (!Number.isInteger(parsedVehicleTypeId) || parsedVehicleTypeId <= 0) {
        throw new Error("Invalid vehicle type.");
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize Distance
    |--------------------------------------------------------------------------
    */
    const normalizedDistanceKm = Math.max(0, Number(distanceKm) || 0);

    /*
    |--------------------------------------------------------------------------
    | Normalize Duration
    |--------------------------------------------------------------------------
    */
    const normalizedDurationMinutes = Math.max(0, Number(durationMinutes) || 0);

    /*
    |--------------------------------------------------------------------------
    | Get Fare Config
    |--------------------------------------------------------------------------
    */
    const fareConfigResult = await defaultFareConfigRepo.findAll({
        is_active: 1,
        vehicle_type_id: parsedVehicleTypeId,
        limit: 1,
    });

    const fareConfig = fareConfigResult.rows?.[0];

    if (!fareConfig) {
        throw new Error("Active fare configuration was not found for this vehicle type.");
    }

    /*
    |--------------------------------------------------------------------------
    | Get Active Surge Pricing
    |--------------------------------------------------------------------------
    */
    const surgeResult = await defaultSurgePricingRepo.findAll({
        is_active: 1,
        vehicle_type_id: parsedVehicleTypeId,
        limit: 1000,
    });

    const surgePricings = surgeResult.rows ?? [];

    const currentTime = new Date().toTimeString().slice(0, 8);

    const surge = getActiveSurge(
        surgePricings,
        parsedVehicleTypeId,
        currentTime
    );

    const multiplier = surge ? Number(surge.multiplier) || 1 : 1;

    /*
    |--------------------------------------------------------------------------
    | Fare Values
    |--------------------------------------------------------------------------
    */
    const baseFare = Number(fareConfig.base_fare) || 0;
    const perKmRate = Number(fareConfig.per_km_rate) || 0;
    const perMinRate = Number(fareConfig.per_min_rate) || 0;
    const minimumFare = Number(fareConfig.minimum_fare) || 0;


    /*
    |--------------------------------------------------------------------------
    | Distance Fare
    |--------------------------------------------------------------------------
    */
    const distanceFare = normalizedDistanceKm * perKmRate;


    /*
    |--------------------------------------------------------------------------
    | Time Fare
    |--------------------------------------------------------------------------
    */
    const timeFare = normalizedDurationMinutes * perMinRate;


    /*
    |--------------------------------------------------------------------------
    | Total Before Minimum Fare
    |--------------------------------------------------------------------------
    */
    const subtotal = baseFare + distanceFare + timeFare;


    /*
    |--------------------------------------------------------------------------
    | Apply Surge
    |--------------------------------------------------------------------------
    */
    let totalFare = subtotal * multiplier;


    /*
    |--------------------------------------------------------------------------
    | Minimum Fare
    |--------------------------------------------------------------------------
    */

    if (totalFare < minimumFare) {
        totalFare = minimumFare;
    }


    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    */
    const currency = (await currencyService.getActiveCurrency()).data ?? {};

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return {
        currency,
        base_fare: Number(baseFare.toFixed(2)),
        distance_fare: Number(distanceFare.toFixed(2)),
        time_fare: Number(timeFare.toFixed(2)),
        surge_multiplier: multiplier,
        total_fare: Number(totalFare.toFixed(2)),
        formatted_total_fare: formatCurrency(totalFare, currency),
    };
};