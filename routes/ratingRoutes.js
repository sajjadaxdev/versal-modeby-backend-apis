import express from "express";

import * as rateContr from "../app/controllers/ratingController.js";

import { validateCreateRating } from "../app/validations/ratingValidator.js";
import { validateRequest } from "../app/middlewares/validateRequest.js";

const router = express.Router();

router.get("/ride/:rideId", rateContr.show);
router.post("/ride/:rideId", validateRequest(validateCreateRating), rateContr.store);

export default router;