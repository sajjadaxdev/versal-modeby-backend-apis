import knex from "../../db/knex.js";

/*
|--------------------------------------------------------------------------
| Get Vehicle Owners
|--------------------------------------------------------------------------
*/

export const findByVehicleId = async (vehicleId) => {

    return await knex("vehicle_owners")
        .where("vehicle_id", vehicleId)
        .orderBy("id", "asc");

};

/*
|--------------------------------------------------------------------------
| Create Owner
|--------------------------------------------------------------------------
*/

export const create = async (data, trx) => {

    const query = trx || knex;

    const [owner] = await query("vehicle_owners")
        .insert(data)
        .returning("*");

    return owner;

};

/*
|--------------------------------------------------------------------------
| Update Owner
|--------------------------------------------------------------------------
*/

export const update = async (id, data, trx) => {

    const query = trx || knex;

    const [owner] = await query("vehicle_owners")
        .where({ id })
        .update(data)
        .returning("*");

    return owner;

};

/*
|--------------------------------------------------------------------------
| Delete Vehicle Owners
|--------------------------------------------------------------------------
*/

export const deleteByVehicleId = async (vehicleId, trx) => {

    const query = trx || knex;

    return await query("vehicle_owners")
        .where("vehicle_id", vehicleId)
        .del();

};