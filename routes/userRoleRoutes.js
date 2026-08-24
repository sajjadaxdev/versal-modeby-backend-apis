import express from "express";

import { getUserRoles, assignUserRoles, syncUserRoles, removeUserRole} from "../app/controllers/userRoleController.js";
import { validateRequest } from "../app/middlewares/validateRequest.js";
import { validateAssignUserRoles } from "../app/validations/userRoleValidation.js";

const router = express.Router();

router.get("/:userId/roles", getUserRoles);
router.post("/:userId/roles", validateRequest(validateAssignUserRoles), assignUserRoles);
router.put("/:userId/roles", validateRequest(validateAssignUserRoles), syncUserRoles);
router.delete("/:userId/roles/:roleId", removeUserRole);

export default router;