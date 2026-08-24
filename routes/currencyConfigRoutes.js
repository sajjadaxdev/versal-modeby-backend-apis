import express from "express";
import { index, show, store, update, destroy, getActive } from "../app/controllers/currencyConfigController.js";
import { validateCreateCurrency, validateUpdateCurrency } from "../app/validations/currencyConfigValidator.js";
import { validateRequest } from "../app/middlewares/validateRequest.js";

const router = express.Router();

router.get("/active", getActive);
router.get("/",     index);
router.get("/:id",  show);
router.post("/",    validateRequest(validateCreateCurrency), store);
router.put("/:id",  validateRequest(validateUpdateCurrency), update);
router.delete("/:id", destroy);

export default router;