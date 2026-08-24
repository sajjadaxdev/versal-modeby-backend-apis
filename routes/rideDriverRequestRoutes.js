import express from "express";

import * as rideDriverRequestController from "../app/controllers/rideDriverRequestController.js";
import { validateRequest } from "../app/middlewares/validateRequest.js";
import { rideDriverRequestResponseValidator } from "../app/validations/rideDriverRequestValidator.js";

const router = express.Router();


router.get("/", rideDriverRequestController.getPendingRequests);

/*
|--------------------------------------------------------------------------
| Accept / Reject Ride Request
|--------------------------------------------------------------------------
*/

router.patch("/:requestId", validateRequest(rideDriverRequestResponseValidator), rideDriverRequestController.respondToRequest);

export default router;