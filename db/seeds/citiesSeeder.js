const fs = require("fs");
const path = require("path");
const turf = require("@turf/turf");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {

    try {

        console.log("Clearing cities table...");

        await knex("cities").del();

        // Agar id bhi 1 se start karni hai
        await knex.raw(`ALTER SEQUENCE cities_id_seq RESTART WITH 1`);

        
        console.log("Importing Afghanistan cities...");

        const filePath = path.join(
            __dirname,
            "../data/AFG_ADM2.geojson"
        );

        const geoJson = JSON.parse(fs.readFileSync(filePath, "utf8"));

        for (const feature of geoJson.features) {

            const name = feature.properties.shapeName;

            const coordinates = feature.geometry.coordinates;

            // let longitude;
            // let latitude;

            // if (feature.geometry.type === "Polygon") {

            //     longitude = feature.geometry.coordinates[0][0][0];
            //     latitude  = feature.geometry.coordinates[0][0][1];

            // } else if (feature.geometry.type === "MultiPolygon") {

            //     longitude = feature.geometry.coordinates[0][0][0][0];
            //     latitude  = feature.geometry.coordinates[0][0][0][1];

            // }

            const center = turf.centroid(feature);

            const longitude = center.geometry.coordinates[0];
            const latitude = center.geometry.coordinates[1];

            const exists = await knex("cities")
                .where({ name })
                .first();

            if (exists) {
                continue;
            }

            await knex("cities").insert({
                name,
                latitude,
                longitude,
                is_active: true,
                geojson: feature.geometry,
                created_at: knex.fn.now(),
                updated_at: knex.fn.now()
            });

            console.log(`${name} imported`);
        }

        console.log("Afghanistan cities imported successfully.");

    } catch (err) {

        console.error(err);

    }

};