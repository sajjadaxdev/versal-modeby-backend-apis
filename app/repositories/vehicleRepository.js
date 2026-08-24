import knex from "../../db/knex.js";
import { getBaseUrl } from "../helpers/fileHelper.js";

const TABLE = "vehicles";

/*
|--------------------------------------------------------------------------
| Get All Vehicles
|--------------------------------------------------------------------------
*/

export const findAll = async (filters) => {

    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 10);
    const search = (filters.search || "").trim();

    const query = knex("vehicles")
        .leftJoin("vehicle_types", "vehicles.vehicle_type_id", "vehicle_types.id")
        .leftJoin("drivers", "vehicles.driver_id", "drivers.id")
        .leftJoin("users", "users.id", "drivers.user_id")

        // Vehicle Owner
        .leftJoin("vehicle_owners", "vehicles.id", "vehicle_owners.vehicle_id")

        // owner tables
        .leftJoin("business", function () {
            this.on("vehicle_owners.owner_id", "=", "business.id")
                .andOn(knex.raw("vehicle_owners.owner_type = ?", ["business"]));
        })

        .leftJoin("franchises", function () {
            this.on("vehicle_owners.owner_id", "=", "franchises.id")
                .andOn(knex.raw("vehicle_owners.owner_type = ?", ["franchise"]));
        })

        .leftJoin("drivers as owner_driver", function () {
            this.on("vehicle_owners.owner_id", "=", "owner_driver.id")
                .andOn(knex.raw("vehicle_owners.owner_type = ?", ["driver"]));
        })

        .leftJoin("users as owner_user", "owner_driver.user_id", "owner_user.id");

    if (search) {

        const normalizedSearch = search
            .replace(/[\s_-]+/g, "")
            .toLowerCase();

        query.where(function () {
            this.whereRaw(
                `LOWER(regexp_replace(vehicles.make,'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            )
            .orWhereRaw(
                `LOWER(regexp_replace(vehicles.model,'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            )
            .orWhere("vehicles.registration_number", "like", `%${search}%`)
            .orWhere("vehicle_types.name", "like", `%${search}%`);
        });

    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        query.where("vehicles.is_active", Number(filters.is_active));
    }

    if (filters.is_verified !== undefined && filters.is_verified !== "") {
        query.where("vehicles.is_verified", Number(filters.is_verified));
    }

    if (filters.vehicle_type_id) {
        query.where("vehicles.vehicle_type_id", filters.vehicle_type_id);
    }

    if (filters.driver_id) {
        query.where("vehicles.driver_id", filters.driver_id);
    }

    if (filters.owner_type) {
        query.where("vehicle_owners.owner_type", filters.owner_type);
    }

    if (filters.owner_id) {
        query.where("vehicle_owners.owner_id", filters.owner_id);
    }

    const totalQuery = query.clone();

    const total = await totalQuery
        .countDistinct("vehicles.id as count")
        .first();

    const rows = await query
        .select(
        "vehicles.*",
        "vehicle_types.name as vehicle_type_name",
        "users.username as driver_name",
        "vehicle_owners.owner_type",
        "vehicle_owners.owner_id",

        knex.raw(`
            CASE
                WHEN vehicle_owners.owner_type = 'business'
                    THEN business.name

                WHEN vehicle_owners.owner_type = 'franchise'
                    THEN franchises.name

                WHEN vehicle_owners.owner_type = 'driver'
                    THEN owner_user.username

                ELSE NULL
            END AS owner_name
        `)
    )
    .orderBy("vehicle_types.display_order", "ASC")
    .limit(limit)
    .offset((page - 1) * limit);

    const imageBaseUrl = getBaseUrl();

    const data = rows.map((item) => ({
        ...item,
        vehicle_image_full: item.vehicle_image
            ? `${imageBaseUrl}/${item.vehicle_image}`
            : null,
    }));

    return {
        rows: data,
        total: Number(total.count),
        page,
        limit,
    };

};

/*
|--------------------------------------------------------------------------
| Find Vehicle By Id
|--------------------------------------------------------------------------
*/

export const findById = async (id) => {

    const vehicle = await knex("vehicles")
        .leftJoin("vehicle_types", "vehicles.vehicle_type_id", "vehicle_types.id")
        .leftJoin("drivers", "vehicles.driver_id", "drivers.id")
        .leftJoin("users", "users.id", "drivers.user_id")
        .select(
            "vehicles.*",
            "vehicle_types.name as vehicle_type_name",
            "users.username as driver_name"
        )
        .where("vehicles.id", id)
        .first();

    if (!vehicle) {
        return null;
    }

    const imageBaseUrl = getBaseUrl();

    vehicle.vehicle_image_full = vehicle.vehicle_image
        ? `${imageBaseUrl}/${vehicle.vehicle_image}`
        : null;

    return vehicle;

};


/*
|--------------------------------------------------------------------------
| Find By Registration Number
|--------------------------------------------------------------------------
*/

export const findByRegistrationNumber = async (registrationNumber) => {

    return await knex("vehicles")
        .whereRaw(
            "LOWER(registration_number) = LOWER(?)",
            [registrationNumber.trim()]
        )
        .first();

};

/*
|--------------------------------------------------------------------------
| Create Vehicle
|--------------------------------------------------------------------------
*/

export const create = async (data, trx = null) => {

    const query = trx ?? knex;

    const [vehicle] = await query("vehicles")
        .insert(data)
        .returning("*");

    return vehicle;

};

/*
|--------------------------------------------------------------------------
| Update Vehicle
|--------------------------------------------------------------------------
*/

export const update = async (id, data, trx = null) => {

    const query = trx ?? knex;

    const [vehicle] = await query("vehicles")
        .where({ id })
        .update(data)
        .returning("*");

    return vehicle;

};

/*
|--------------------------------------------------------------------------
| Delete Vehicle
|--------------------------------------------------------------------------
*/

export const remove = async (id) => {

    return await knex("vehicles")
        .where({ id })
        .del();

};

/*
|--------------------------------------------------------------------------
| Assign Driver
|--------------------------------------------------------------------------
*/

export const assignDriver = async (vehicleId, driverId) => {

    const [vehicle] = await knex("vehicles")
        .where({ id: vehicleId })
        .update({
            driver_id: driverId,
            updated_at: knex.fn.now(),
        })
        .returning("*");

    return vehicle;

};

export const findByDriverId = async (driverId) => {

    return await knex(TABLE)
    .leftJoin("vehicle_types", "vehicles.vehicle_type_id", "vehicle_types.id")
    .select(
        "vehicles.*",
        "vehicle_types.name as vehicle_type",
    )
    .where("vehicles.driver_id", driverId)
    .first();

};

export const findDriverVehicle = async (driverId, columns = ["*"]) => {

    return await knex(TABLE)
    .select(columns)
    .where("driver_id", driverId)
    .first();

};

export const updateById = async (id, data) => {

    const [vehicle] = await knex(TABLE)
        .where({ id })
        .update({
            ...data,
            updated_at: knex.fn.now(),
        })
        .returning("*");

    return vehicle;

};