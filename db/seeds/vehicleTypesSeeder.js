
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  try {

    
    await knex("vehicle_types").del();
    await knex("vehicle_types").insert([

        {
            name: "Bike",
            icon: "bike.png",
            seating_capacity: 1,
            description: "Motorcycles for quick and affordable rides.",
            display_order: 1,
            is_active: true,
        },

        {
            name: "Auto Rickshaw",
            icon: "auto-rickshaw.png",
            seating_capacity: 3,
            description: "Three-wheeler rides suitable for short city trips.",
            display_order: 2,
            is_active: true,
        },

        {
            name: "Economy Car",
            icon: "economy-car.png",
            seating_capacity: 4,
            description: "Affordable everyday cars such as Alto, Cultus and WagonR.",
            display_order: 3,
            is_active: true,
        },

        {
            name: "Sedan",
            icon: "sedan.png",
            seating_capacity: 4,
            description: "Comfortable sedans including Corolla, Civic and Yaris.",
            display_order: 4,
            is_active: true,
        },

        {
            name: "Hatchback",
            icon: "hatchback.png",
            seating_capacity: 4,
            description: "Compact hatchback cars like Swift and Picanto.",
            display_order: 5,
            is_active: true,
        },

        {
            name: "SUV",
            icon: "suv.png",
            seating_capacity: 7,
            description: "Spacious SUVs such as Fortuner, Prado and Tucson.",
            display_order: 6,
            is_active: true,
        },

        {
            name: "Mini Van",
            icon: "mini-van.png",
            seating_capacity: 12,
            description: "Large vans for families and group travel.",
            display_order: 7,
            is_active: true,
        },

        {
            name: "Luxury",
            icon: "luxury.png",
            seating_capacity: 4,
            description: "Premium luxury vehicles including Mercedes, BMW and Audi.",
            display_order: 8,
            is_active: true,
        },

        {
            name: "Electric Car",
            icon: "electric-car.png",
            seating_capacity: 4,
            description: "Eco-friendly electric vehicles such as BYD and MG4.",
            display_order: 9,
            is_active: true,
        },

    ]);

    console.log("Vehicle Types Created");

  } catch (error) {
    console.error("Seed error:", error);
  }
};