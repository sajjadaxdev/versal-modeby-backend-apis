import express from "express";

import * as driverController from "../app/controllers/driverController.js";

import {validateRequest} from "../app/middlewares/validateRequest.js";

import * as driverValidator from "../app/validations/driverValidator.js";
import upload from "../app/middlewares/upload.js";

const router = express.Router();

router.get("/", driverController.index);
router.get("/show/:id", driverController.show);
router.post("/register", validateRequest(driverValidator.registerDriverValidator), driverController.register);
router.put("/basic-info", upload("driver").single("personal_picture"), validateRequest(driverValidator.updateBasicInfoValidator), driverController.updateBasicInfo);
router.put("/identity", upload("driver").fields([ { name: "cnic_front_side_picture", maxCount: 1, }, { name: "cnic_back_side_picture", maxCount: 1, } ]), validateRequest(driverValidator.updateIdentityValidator), driverController.updateIdentity);
router.put("/license", upload("driver").fields([{ name: "license_front_side_picture", maxCount: 1,}, { name: "selfie_with_driver_license", maxCount: 1, } ]), validateRequest(driverValidator.updateLicenseValidator), driverController.updateLicense);
router.put("/vehicle", upload("vehicle").single("vehicle_image"), validateRequest(driverValidator.updateVehicleValidator), driverController.updateVehicle);
router.post("/submit", validateRequest(driverValidator.submitDriverValidator), driverController.submit);
router.get("/progress", driverController.progress);

router.get("/basic-info", driverController.getBasicInfo);
router.get("/identity", driverController.getIdentity);
router.get("/license", driverController.getLicense);
router.get("/vehicle", driverController.getVehicle);
router.get("/application", driverController.getApplication);
router.patch("/:driverId/documents/:documentType", validateRequest(driverValidator.validateDriverDocumentVerification), driverController.verifyDocument);

router.patch("/me/online-status", validateRequest(driverValidator.validateDriverOnlineStatus), driverController.updateOnlineStatus );
router.get("/me/online-status", driverController.getOnlineStatus );

router.patch("/me/location", validateRequest(driverValidator.validateDriverLocation), driverController.updateLocation);
router.get("/me/location", driverController.getMyLocation);
router.get("/:driverId/location", driverController.getDriverLocation);

export default router;