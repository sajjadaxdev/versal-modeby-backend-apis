import express from "express";
import { index, translations } from "../app/controllers/languageController.js";

const router = express.Router();

router.get("/",            index);        // GET /api/v1/languages
router.get("/translations", translations); // GET /api/v1/languages/translations?lang=en

export default router;