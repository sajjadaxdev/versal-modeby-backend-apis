import express from "express";

import * as notificationController  from "../app/controllers/notificationController.js";


const router = express.Router();


router.post( "/test", notificationController.sendTestNotification);

router.get("/", notificationController.index);
router.get("/unread-count", notificationController.unreadCount);
router.patch("/read-all", notificationController.markAllAsRead);
router.patch("/:notificationId/read", notificationController.markAsRead);

export default router;