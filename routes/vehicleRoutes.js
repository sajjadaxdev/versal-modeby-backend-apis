import express from "express";

import * as vehicleController from "../app/controllers/vehicleController.js";

import upload from "../app/middlewares/upload.js";
import { validateRequest } from "../app/middlewares/validateRequest.js";

import {validateCreateVehicle, validateUpdateVehicle, validateAssignDriver} from "../app/validations/vehicleValidator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Vehicles
|--------------------------------------------------------------------------
*/

router.get("/", vehicleController.index);
router.get("/:id", vehicleController.show);
router.post("/", upload("vehicles").single("vehicle_image"), validateRequest(validateCreateVehicle), vehicleController.store);
router.put("/:id", upload("vehicles").single("vehicle_image"), validateRequest(validateUpdateVehicle), vehicleController.update);
router.patch("/:id/assign-driver", validateRequest(validateAssignDriver), vehicleController.assignDriver);
router.delete("/:id", vehicleController.destroy);

export default router;
