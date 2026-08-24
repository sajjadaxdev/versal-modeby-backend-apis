import express from "express";
import { index, show, store, update, destroy, getActiveSurge }
    from "../app/controllers/surgePricingController.js";
import { validateCreateSurgePricing, validateUpdateSurgePricing }
    from "../app/validations/surgePricingValidator.js";
import { validateRequest } from "../app/middlewares/validateRequest.js";

const router = express.Router();

router.get("/active-surge", getActiveSurge);
router.get("/",      index);
router.get("/:id",   show);
router.post("/",     validateRequest(validateCreateSurgePricing), store);
router.put("/:id",   validateRequest(validateUpdateSurgePricing), update);
router.delete("/:id", destroy);

export default router;