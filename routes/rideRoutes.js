import express from "express";
import * as rideContr from "../app/controllers/rideController.js";
import { rideOptionsValidator, rideRequestValidator } from "../app/validations/rideValidator.js";
import { validateRequest } from "../app/middlewares/validateRequest.js";

const router = express.Router();

router.post("/ride-options",     validateRequest(rideOptionsValidator), rideContr.getRideOptions);
router.post("/request",     validateRequest(rideRequestValidator), rideContr.requestRide);

router.get("/nearest-driver/:rideId", rideContr.findNearestDriver);
router.patch("/:rideId/cancel", rideContr.cancelRide);
router.get("/:rideId/status", rideContr.getRideStatus);
router.patch("/:rideId/status", rideContr.updateRideStatus);

router.get("/:rideId/tracking", rideContr.getRideTracking);

export default router;