import express from "express";
import { register, login, sendOTP, verifyOTP, updateUsername, validateToken, googleLogin } from "../app/controllers/authController.js";
import { validateUserRegister, validateUserLogin, validateSendOTP, validateVerifyOTP, validateUpdateUsername, validateGoogleLogin } from "../app/validations/userValidation.js";
import { validateRequest } from "../app/middlewares/validateRequest.js";

const router = express.Router();

router.post("/register", validateRequest(validateUserRegister), register);
router.post("/login", validateRequest(validateUserLogin), login);
router.post("/send-otp", validateRequest(validateSendOTP), sendOTP);
router.post("/verify-otp", validateRequest(validateVerifyOTP), verifyOTP);
router.post("/update-username", validateRequest(validateUpdateUsername), updateUsername);
router.post("/google-login", validateRequest(validateGoogleLogin), googleLogin);
router.get("/validate-token", validateToken);

export default router;
