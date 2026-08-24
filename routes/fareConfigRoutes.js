import express from "express";

import * as fareConfigController from "../app/controllers/fareConfigController.js";
import * as rules from "../app/validations/fareConfigValidator.js";

import { validateRequest } from "../app/middlewares/validateRequest.js";


const router = express.Router();

/*
|--------------------------------------------------------------------------
| Fare Config Routes
|--------------------------------------------------------------------------
*/

router.get("/", fareConfigController.index);
router.get("/:id", fareConfigController.show);
router.post("/", validateRequest(rules.createValidator), fareConfigController.store);
router.put("/:id", validateRequest(rules.updateValidator), fareConfigController.update);
router.patch("/:id/update-status", validateRequest(rules.updateStatusValidator), fareConfigController.updateStatus);
router.delete("/:id", fareConfigController.destroy);

export default router;