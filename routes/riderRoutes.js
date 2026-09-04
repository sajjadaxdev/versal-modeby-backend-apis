import express from "express";
import * as riderController from "../app/controllers/riderController.js";
import { validateRequest } from "../app/middlewares/validateRequest.js";

import {
    createRiderValidator,
    updateRiderValidator,
} from "../app/validations/riderValidator.js";

const router = express.Router();

router.post("/", validateRequest(createRiderValidator), riderController.create);
router.get("/profile", riderController.profile);
router.put("/profile", validateRequest(updateRiderValidator), riderController.update);
router.delete("/profile", riderController.remove);
router.get("/session", riderController.getSession);

export default router;