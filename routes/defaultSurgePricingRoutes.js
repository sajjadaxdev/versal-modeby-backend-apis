import express from "express";
import {
    index, show, store, update, destroy, getActiveSurge
} from "../app/controllers/defaultSurgePricingController.js";
import {
    validateCreateSurgePricing,
    validateUpdateSurgePricing,
} from "../app/validations/defaultSurgePricingValidator.js";
import { validateRequest } from "../app/middlewares/validateRequest.js";

const router = express.Router();

router.get("/active-surge", getActiveSurge); // ← /:id se pehle
router.get("/",     index);
router.get("/:id",  show);
router.post("/",    validateRequest(validateCreateSurgePricing), store);
router.put("/:id",  validateRequest(validateUpdateSurgePricing), update);
router.delete("/:id", destroy);

export default router;