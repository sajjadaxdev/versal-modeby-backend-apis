import knex from "../../db/knex.js";

const TABLE = "drivers";

/*
|--------------------------------------------------------------------------
| Get All Drivers
|--------------------------------------------------------------------------
*/

export const findAll = async (filters = {}) => {

    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 10);
    const search = (filters.search || "").trim();

    const query = knex("drivers")
        .leftJoin("users", "drivers.user_id", "users.id")
        .leftJoin("vehicles", "drivers.id", "vehicles.driver_id")
        .leftJoin("vehicle_types", "vehicles.vehicle_type_id", "vehicle_types.id")

        // Latest personal picture review
        .leftJoin(
            knex.raw(`
                LATERAL (
                    SELECT
                        dvr.action,
                        dvr.reason
                    FROM driver_verification_reviews dvr
                    WHERE dvr.driver_id = drivers.id
                    AND dvr.document_type = 'personal_picture'
                    ORDER BY dvr.id DESC
                    LIMIT 1
                ) AS personal_picture_review ON true
            `)
        )

        // Latest CNIC front review
        .leftJoin(
            knex.raw(`
                LATERAL (
                    SELECT
                        dvr.action,
                        dvr.reason
                    FROM driver_verification_reviews dvr
                    WHERE dvr.driver_id = drivers.id
                    AND dvr.document_type = 'cnic_front'
                    ORDER BY dvr.id DESC
                    LIMIT 1
                ) AS cnic_front_review ON true
            `)
        )

        // Latest CNIC back review
        .leftJoin(
            knex.raw(`
                LATERAL (
                    SELECT
                        dvr.action,
                        dvr.reason
                    FROM driver_verification_reviews dvr
                    WHERE dvr.driver_id = drivers.id
                    AND dvr.document_type = 'cnic_back'
                    ORDER BY dvr.id DESC
                    LIMIT 1
                ) AS cnic_back_review ON true
            `)
        )

        // Latest Driving license front review
        .leftJoin(
            knex.raw(`
                LATERAL (
                    SELECT
                        dvr.action,
                        dvr.reason
                    FROM driver_verification_reviews dvr
                    WHERE dvr.driver_id = drivers.id
                    AND dvr.document_type = 'license_front'
                    ORDER BY dvr.id DESC
                    LIMIT 1
                ) AS license_front_review ON true
            `)
        )

        // Latest selfie With Driving license review
        .leftJoin(
            knex.raw(`
                LATERAL (
                    SELECT
                        dvr.action,
                        dvr.reason
                    FROM driver_verification_reviews dvr
                    WHERE dvr.driver_id = drivers.id
                    AND dvr.document_type = 'license_selfie'
                    ORDER BY dvr.id DESC
                    LIMIT 1
                ) AS license_selfie_review ON true
            `)
        )

        // Latest selfie With Driving license review
        .leftJoin(
            knex.raw(`
                LATERAL (
                    SELECT
                        dvr.action,
                        dvr.reason
                    FROM driver_verification_reviews dvr
                    WHERE dvr.driver_id = drivers.id
                    AND dvr.document_type = 'vehicle'
                    ORDER BY dvr.id DESC
                    LIMIT 1
                ) AS vehicle_review ON true
            `)
        )
        ;

        

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search) {

        const normalizedSearch = search.replace(/[\s_-]+/g, "").toLowerCase();

        query.where(function () {

            this.whereRaw(
                `LOWER(regexp_replace(users.username,'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            )
            .orWhere("drivers.first_name", "like", `%${search}%`)
            .orWhere("drivers.last_name", "like", `%${search}%`)
            .orWhere("users.email", "like", `%${search}%`)
            .orWhere("users.phone", "like", `%${search}%`)
            .orWhere("vehicles.registration_number", "like", `%${search}%`);

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Filters
    |--------------------------------------------------------------------------
    */

    if (filters.verification_status) {

        if(filters.verification_status == 'pending') {
            query.whereIn("drivers.verification_status", ['under_review', 'submitted']);
        }else {
            query.where("drivers.verification_status", filters.verification_status);
        }
    }

    if (filters.vehicle_type_id) {
        query.where("vehicles.vehicle_type_id", filters.vehicle_type_id);
    }

    if (filters.is_available) {
        query.where("drivers.is_available", Number(filters.is_available));
    }

    if (filters.is_online) {
        query.where("drivers.is_online", Number(filters.is_online));
    }

    /*
    |--------------------------------------------------------------------------
    | Total Count
    |--------------------------------------------------------------------------
    */

    const totalQuery = query.clone();

    const total = await totalQuery
        .countDistinct("drivers.id as count")
        .first();

    /*
    |--------------------------------------------------------------------------
    | Rows
    |--------------------------------------------------------------------------
    */

    const rows = await query
        .select(
            "drivers.*",

            "users.username",
            "users.email",
            "users.phone",

            // Personal picture review
            "personal_picture_review.action AS personal_picture_review_action",
            "personal_picture_review.reason AS personal_picture_review_reason",

            // CNIC front review
            "cnic_front_review.action AS cnic_front_review_action",
            "cnic_front_review.reason AS cnic_front_review_reason",

            // CNIC back review
            "cnic_back_review.action AS cnic_back_review_action",
            "cnic_back_review.reason AS cnic_back_review_reason",

            //Driving license front review
            "license_front_review.action AS license_front_review_action",
            "license_front_review.reason AS license_front_review_reason",

            //Selfie With Driving license
            "license_selfie_review.action AS license_selfie_review_action",
            "license_selfie_review.reason AS license_selfie_review_reason",

            //Vehicle Review
            "vehicle_review.action AS vehicle_review_action",
            "vehicle_review.reason AS vehicle_review_reason",

            "vehicles.id    AS vehicle_id",
            "vehicles.vehicle_verification_status",
            "vehicles.make  AS vehicle_make",
            "vehicles.model AS vehicle_model",
            "vehicles.year  AS vehicle_year",
            "vehicles.color AS vehicle_color",
            "vehicles.vehicle_image",
            "vehicles.registration_number AS vehicle_registration_number",
            "vehicle_types.name as vehicle_type",
            "vehicles.is_verified AS is_vehicle_verified",
            "vehicles.is_active AS is_vehicle_active",
            "vehicles.allow_city_ride AS vehicle_allow_city_ride",
            "vehicles.allow_intercity_ride AS vehicle_allow_intercity_ride",
        )
        .distinct("drivers.id")
        .orderBy("drivers.id", "desc")
        .limit(limit)
        .offset((page - 1) * limit);

    return {

        rows: rows,
        total: Number(total.count),
        page,
        limit,

    };

};

export const findById = async (id) => {

    const row = await knex("drivers")
        .leftJoin("users", "drivers.user_id", "users.id")
        .leftJoin("vehicles", "drivers.id", "vehicles.driver_id")
        .leftJoin("vehicle_types", "vehicles.vehicle_type_id", "vehicle_types.id")

        // Latest personal picture review
        .leftJoin(
            knex.raw(`
                LATERAL (
                    SELECT
                        dvr.action,
                        dvr.reason
                    FROM driver_verification_reviews dvr
                    WHERE dvr.driver_id = drivers.id
                    AND dvr.document_type = 'personal_picture'
                    ORDER BY dvr.id DESC
                    LIMIT 1
                ) AS personal_picture_review ON true
            `)
        )

        // Latest CNIC front review
        .leftJoin(
            knex.raw(`
                LATERAL (
                    SELECT
                        dvr.action,
                        dvr.reason
                    FROM driver_verification_reviews dvr
                    WHERE dvr.driver_id = drivers.id
                    AND dvr.document_type = 'cnic_front'
                    ORDER BY dvr.id DESC
                    LIMIT 1
                ) AS cnic_front_review ON true
            `)
        )

        // Latest CNIC back review
        .leftJoin(
            knex.raw(`
                LATERAL (
                    SELECT
                        dvr.action,
                        dvr.reason
                    FROM driver_verification_reviews dvr
                    WHERE dvr.driver_id = drivers.id
                    AND dvr.document_type = 'cnic_back'
                    ORDER BY dvr.id DESC
                    LIMIT 1
                ) AS cnic_back_review ON true
            `)
        )

        // Latest Driving license front review
        .leftJoin(
            knex.raw(`
                LATERAL (
                    SELECT
                        dvr.action,
                        dvr.reason
                    FROM driver_verification_reviews dvr
                    WHERE dvr.driver_id = drivers.id
                    AND dvr.document_type = 'license_front'
                    ORDER BY dvr.id DESC
                    LIMIT 1
                ) AS license_front_review ON true
            `)
        )

        // Latest selfie With Driving license review
        .leftJoin(
            knex.raw(`
                LATERAL (
                    SELECT
                        dvr.action,
                        dvr.reason
                    FROM driver_verification_reviews dvr
                    WHERE dvr.driver_id = drivers.id
                    AND dvr.document_type = 'license_selfie'
                    ORDER BY dvr.id DESC
                    LIMIT 1
                ) AS license_selfie_review ON true
            `)
        )

        // Latest selfie With Driving license review
        .leftJoin(
            knex.raw(`
                LATERAL (
                    SELECT
                        dvr.action,
                        dvr.reason
                    FROM driver_verification_reviews dvr
                    WHERE dvr.driver_id = drivers.id
                    AND dvr.document_type = 'vehicle'
                    ORDER BY dvr.id DESC
                    LIMIT 1
                ) AS vehicle_review ON true
            `)
        )

        .where("drivers.id", id)
        .select(
            "drivers.*",

            "users.username",
            "users.email",
            "users.phone",
            
            // Personal picture review
            "personal_picture_review.action AS personal_picture_review_action",
            "personal_picture_review.reason AS personal_picture_review_reason",

            // CNIC front review
            "cnic_front_review.action AS cnic_front_review_action",
            "cnic_front_review.reason AS cnic_front_review_reason",

            // CNIC back review
            "cnic_back_review.action AS cnic_back_review_action",
            "cnic_back_review.reason AS cnic_back_review_reason",

            //Driving license front review
            "license_front_review.action AS license_front_review_action",
            "license_front_review.reason AS license_front_review_reason",

            //Selfie With Driving license
            "license_selfie_review.action AS license_selfie_review_action",
            "license_selfie_review.reason AS license_selfie_review_reason",

            //Vehicle Review
            "vehicle_review.action AS vehicle_review_action",
            "vehicle_review.reason AS vehicle_review_reason",
            "vehicles.vehicle_verification_status",

            "vehicles.id    AS vehicle_id",
            "vehicles.make  AS vehicle_make",
            "vehicles.model AS vehicle_model",
            "vehicles.year  AS vehicle_year",
            "vehicles.color AS vehicle_color",
            "vehicles.vehicle_image",
            "vehicles.registration_number AS vehicle_registration_number",
            "vehicle_types.name as vehicle_type",
            "vehicles.is_verified AS is_vehicle_verified",
            "vehicles.is_active AS is_vehicle_active",
            "vehicles.allow_city_ride AS vehicle_allow_city_ride",
            "vehicles.allow_intercity_ride AS vehicle_allow_intercity_ride",
        )
        .first();

    return row;

};

export const create = async (data, trx = null) => {

    const query = trx ?? knex;

    const [driver] = await query(TABLE)
        .insert(data)
        .returning("*");

    return driver;
};

export const findOnlyDriverById = async (driverId) => {

    return await knex("drivers")
        .where("id", driverId)
        .first();

};

export const findOnlyDriverByUserId = async (userId, columns = ['*']) => {

    return await knex("drivers")
        .where("user_id", userId)
        .select(columns)
        .first();

};

export const findDriverForOnlineStatusByUserId = async (userId) => {

    const driver = await knex(TABLE)
        .where({ user_id: userId })
        .select(
            "drivers.id",
            "drivers.verification_status",
            "drivers.is_online",
            "drivers.is_available"
        )
        .first();

    return driver;
};

export const findByUserId = async (userId, columns = ["*"]) => {
    return await knex(TABLE)
        .select(columns)
        .where({ user_id: userId })
        .first();
};

export const updateById = async (id, data) => {
    const [driver] = await knex(TABLE)
        .where({ id })
        .update({
            ...data,
            updated_at: knex.fn.now(),
        })
        .returning("*");

    return driver;
};

export const updateByUserId = async (userId, data) => {
    const [driver] = await knex(TABLE)
        .where({ user_id: userId })
        .update({
            ...data,
            updated_at: knex.fn.now(),
        })
        .returning("*");

    return driver;
};

export const deleteById = async (id) => {
    return await knex(TABLE)
        .where({ id })
        .del();
};

export const deleteByUserId = async (userId) => {
    return await knex(TABLE)
        .where({ user_id: userId })
        .del();
};

export const getDriverDetails = async (userId, columns) => {
    const driver = await knex(TABLE)
        .where("user_id", userId)
        .select(columns)
        .first();

    return driver;
};

/*
|--------------------------------------------------------------------------
| Update Document Verification
|--------------------------------------------------------------------------
*/

export const updateDocumentVerification = async (
    driverId,
    table,
    statusColumn,
    status,
    documentType,
    reason,
    reviewedBy
) => {

    return await knex.transaction(async (trx) => {

        let updatedRecord;

        /*
        |--------------------------------------------------------------------------
        | Update document status
        |--------------------------------------------------------------------------
        */

        if (table === "vehicles") {

            const [vehicle] = await trx("vehicles")
                .where("driver_id", driverId)
                .update({
                    [statusColumn]: status,
                    updated_at: trx.fn.now(),
                })
                .returning("*");

            updatedRecord = vehicle;

        } else {

            const [driver] = await trx("drivers")
                .where("id", driverId)
                .update({
                    [statusColumn]: status,
                    updated_at: trx.fn.now(),
                })
                .returning("*");

            updatedRecord = driver;
        }


        /*
        |--------------------------------------------------------------------------
        | Create Verification Review History
        |--------------------------------------------------------------------------
        */

        const [review] = await trx("driver_verification_reviews")
            .insert({
                driver_id: driverId,
                document_type: documentType,
                action: status,
                reason: reason || null,
                reviewed_by: reviewedBy || null,
                created_at: trx.fn.now(),
            })
            .returning("*");


        return {
            record: updatedRecord,
            review,
        };

    });
};
 

export const updateOnlineStatus = async (
    driverId,
    isOnline,
    isAvailable
) => {

    const updated = await knex("drivers")
        .where("id", driverId)
        .update({
            is_online: isOnline,
            is_available: isAvailable,
            updated_at: knex.fn.now(),
        })
        .returning([
            "id",
            "is_online",
            "is_available",
        ]);

    return updated;
};

/**
 * Find eligible drivers for a ride.
 *
 * Conditions:
 * - Driver must be approved
 * - Driver must be online
 * - Driver must be available
 * - Driver must have an active vehicle
 * - Vehicle must be verified
 * - Vehicle must match requested vehicle type
 * - Driver must have a location
 * - Driver location must be updated within last 30 seconds
 * - Driver must be within 5 KM of pickup location
 *
 * Result:
 * - Nearest drivers first
 */
export const findEligibleDrivers = async ({
    vehicleTypeId,
    pickupLat,
    pickupLng,
    excludeDriverIds = [],
}) => {

    const maxDistanceKm = 5;

    const query = knex
        .select([
            "d.id as driver_id",
            "d.user_id",
            "d.rating",
            "u.fcm_id",
            "v.id as vehicle_id",
            "v.vehicle_type_id",

            "dl.latitude",
            "dl.longitude",
            "dl.heading",
            "dl.speed",
            "dl.last_update",

            knex.raw(`
                (
                    6371 * acos(
                        LEAST(
                            1,
                            GREATEST(
                                -1,
                                cos(radians(?))
                                * cos(radians(dl.latitude))
                                * cos(radians(dl.longitude) - radians(?))
                                + sin(radians(?))
                                * sin(radians(dl.latitude))
                            )
                        )
                    )
                ) as distance_km
            `, [
                pickupLat,
                pickupLng,
                pickupLat,
            ]),
        ])
        .from("drivers as d")
        .join("vehicles as v", "v.driver_id", "d.id")
        .join("driver_location as dl", "dl.driver_id", "d.id")
        .join("users as u", "u.id", "d.user_id")
        .where("v.vehicle_type_id", vehicleTypeId)
        .where("d.verification_status", "approved")
        .where("d.is_online", true)
        .where("d.is_available", true)
        .where("v.is_active", true)
        .where("v.is_verified", true)

        .whereRaw(`
            dl.last_update >= NOW() - INTERVAL '30 seconds'
        `);

        if (excludeDriverIds.length) {
            query.whereNotIn("d.id", excludeDriverIds);
        }

    return await knex
        .select("*")
        .from(query.as("eligible_drivers"))
        .where("distance_km", "<=", maxDistanceKm)
        .orderBy("distance_km", "asc");
};

/*
|--------------------------------------------------------------------------
| Find Driver Vehicle For Ride
|--------------------------------------------------------------------------
*/

export const findActiveVehicleForRide = async (
    driverId,
    vehicleTypeId,
    trx = knex
) => {

    return await trx("vehicles")
        .where("driver_id", driverId)
        .where("vehicle_type_id", vehicleTypeId)
        .where("is_active", true)
        .where("is_verified", true)
        .first();
};

/*
|--------------------------------------------------------------------------
| Mark Driver Busy
|--------------------------------------------------------------------------
*/

export const updateAvailability = async (
    driverId,
    isAvailable,
    trx = knex
) => {

    const [driver] = await trx("drivers")
        .where("id", driverId)
        .update({
            is_available: isAvailable,
            updated_at: knex.fn.now(),
        })
        .returning("*");

    return driver;
};

/*
|--------------------------------------------------------------------------
| GET ACTIVE RIDE
|--------------------------------------------------------------------------
*/

export const getActiveRideByDriverId = async (driverId) => {

    return await knex("rides")
        .select(["id", "status"])
        .where("driver_id", driverId)
        .where("status", "in_progress")
        .first();
};