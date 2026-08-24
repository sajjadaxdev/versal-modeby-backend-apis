import express from "express";

import * as filterController from "../app/controllers/filterController.js";

const router = express.Router();


router.get("/vehicle-types", filterController.vehicleTypes);
router.get("/vehicle-owners", filterController.vehicleOwners);
router.get("/cities", filterController.cities);

export default router;