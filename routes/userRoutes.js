import express from "express";
import { getUsers, updateUserFcmToken } from "../app/controllers/userController.js";
import { validateRequest } from "../app/middlewares/validateRequest.js";
import { validateUpdateFCM } from "../app/validations/userValidation.js";

const router = express.Router();

router.get("/", getUsers);
router.patch("/update-fcm-token", validateRequest(validateUpdateFCM), updateUserFcmToken);

export default router;
