import express from "express";
import {
    getPermissions,
    getPermission,
    createPermission,
    updatePermission,
    deletePermission,
} from "../app/controllers/permissionController.js";

import * as rules from "../app/validations/permissionValidation.js";
import { validateRequest } from "../app/middlewares/validateRequest.js";

const router = express.Router();

router.get("/", getPermissions);
router.get("/:id", getPermission);
router.post("/", validateRequest(rules.validateCreatePermission), createPermission);
router.put("/:id", validateRequest(rules.validateUpdatePermission), updatePermission);
router.delete("/:id", deletePermission);

export default router;