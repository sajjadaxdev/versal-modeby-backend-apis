import express from "express";

import * as vehicleTypeController from "../app/controllers/vehicleTypeController.js";

import { validateRequest } from "../app/middlewares/validateRequest.js";
import upload from "../app/middlewares/upload.js";

import {
    validateCreateVehicleType,
    validateUpdateVehicleType,
} from "../app/validations/vehicleTypeValidator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Vehicle Types
|--------------------------------------------------------------------------
*/

router.get("/", vehicleTypeController.index);
router.get("/:id", vehicleTypeController.show);
router.post("/", upload("vehicleTypes").single("icon"), validateRequest(validateCreateVehicleType), vehicleTypeController.store);
router.put("/:id", upload("vehicleTypes").single("icon"), validateRequest(validateUpdateVehicleType), vehicleTypeController.update );
router.delete("/:id", vehicleTypeController.destroy);

export default router;