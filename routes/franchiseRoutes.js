import express from "express";

import {
    getFranchises,
    getFranchise,
    createFranchise,
    updateFranchise,
    deleteFranchise,
} from "../app/controllers/franchiseController.js";

import * as rules from "../app/validations/franchiseValidation.js";

import { validateRequest } from "../app/middlewares/validateRequest.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Franchise Routes
|--------------------------------------------------------------------------
*/

router.get("/", getFranchises);
router.get("/:id", getFranchise);
router.post("/", validateRequest(rules.validateCreateFranchise), createFranchise);
router.put("/:id", validateRequest(rules.validateUpdateFranchise), updateFranchise);
router.delete("/:id", deleteFranchise);

export default router;