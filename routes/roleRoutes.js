import express from "express";
import {getRoles, getRole, createRole, updateRole, deleteRole} from "../app/controllers/roleController.js";
import {getRolePermissions,syncRolePermissions,removeRolePermission} from "../app/controllers/rolePermissionController.js";
import * as rules from "../app/validations/roleValidation.js";
import {validateSyncRolePermissions} from "../app/validations/rolePermissionValidation.js";
import { validateRequest } from "../app/middlewares/validateRequest.js";

const router = express.Router();

router.get("/", getRoles);
router.get("/:id", getRole);
router.post("/", validateRequest(rules.validateCreateRole), createRole);
router.put("/:id", validateRequest(rules.validateUpdateRole), updateRole);
router.delete("/:id", deleteRole);

router.get("/:roleId/permissions", getRolePermissions);
router.put("/:roleId/permissions", validateRequest(validateSyncRolePermissions), syncRolePermissions);
router.delete("/:roleId/permissions/:permissionId", removeRolePermission);

export default router;