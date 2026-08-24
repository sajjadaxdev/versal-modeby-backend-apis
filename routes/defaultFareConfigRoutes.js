import express from "express";

import * as defaultFareConfigController from "../app/controllers/defaultFareConfigController.js";
import * as rules from "../app/validations/defaultFareConfigValidator.js";

import { validateRequest } from "../app/middlewares/validateRequest.js";


const router = express.Router();

/*
|--------------------------------------------------------------------------
| Fare Config Routes
|--------------------------------------------------------------------------
*/

router.get("/", defaultFareConfigController.index);
router.get("/:id", defaultFareConfigController.show);
router.post("/", validateRequest(rules.createValidator), defaultFareConfigController.store);
router.put("/:id", validateRequest(rules.updateValidator), defaultFareConfigController.update);
router.patch("/:id/update-status", validateRequest(rules.updateStatusValidator), defaultFareConfigController.updateStatus);
router.delete("/:id", defaultFareConfigController.destroy);

export default router;