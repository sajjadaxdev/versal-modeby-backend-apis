import express from "express";

import {index, show, store, update, destroy} from "../app/controllers/businessController.js";
import { validateCreateBusines, validateUpdateBusines } from "../app/validations/businessValidator.js";

import { validateRequest } from "../app/middlewares/validateRequest.js";
import upload from "../app/middlewares/upload.js";

const router = express.Router();

router.get("/", index);
router.get("/:id", show);
router.post("/", upload("business").single("logo"), validateRequest(validateCreateBusines), store);
router.put("/:id", upload("business").single("logo"), validateRequest(validateUpdateBusines), update);
router.delete("/:id", destroy);

export default router;