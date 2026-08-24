import * as notificationService from "../services/notificationService.js";
import { testNotificationTemplate } from "../notifications/templates/testNotification.js";

/*
|--------------------------------------------------------------------------
| Get Notifications
|--------------------------------------------------------------------------
*/

export const index = async (req, res, next) => {

    try {
        
        const response = await notificationService.getUserNotifications(req.user.id, req.query);

        return res.json(response);

    } catch (error) {

        next(error);

    }
};


/*
|--------------------------------------------------------------------------
| Mark Notification As Read
|--------------------------------------------------------------------------
*/

export const markAsRead = async (req, res, next) => {

    try {

        const response = await notificationService.markAsRead({
            userId: req.user.id,
            notificationId: req.params.notificationId,
        });

        return res.json(response);

    } catch (error) {

        next(error);

    }
};


/*
|--------------------------------------------------------------------------
| Mark All As Read
|--------------------------------------------------------------------------
*/

export const markAllAsRead = async (req, res, next) => {

    try {

        const response = await notificationService.markAllAsRead(
            req.user.id
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }
};


/*
|--------------------------------------------------------------------------
| Unread Count
|--------------------------------------------------------------------------
*/

export const unreadCount = async (req, res, next) => {

    try {

        const response = await notificationService.getUnreadCount(
            req.user.id
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }
};


/*
|--------------------------------------------------------------------------
| Send Test Notification
|--------------------------------------------------------------------------
*/

export const sendTestNotification = async (req, res) => {

    try {

        const {token, name = "User"} = req.body;

        /*
        |--------------------------------------------------------------------------
        | Validate FCM Token
        |--------------------------------------------------------------------------
        */

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "FCM token is required.",
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Notification Template
        |--------------------------------------------------------------------------
        */

        const notification = testNotificationTemplate({
            name,
        });


        /*
        |--------------------------------------------------------------------------
        | Send Notification
        |--------------------------------------------------------------------------
        */

        const messageId = await notificationService.sendToToken({
            token,
            title: notification.title,
            body: notification.body,
            data: notification.data,
        });


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return res.status(200).json({
            success: true,
            message: "Test notification sent successfully.",
            data: {
                message_id: messageId,
            },

        });

    } catch (error) {

        console.error(
            "Send test notification error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error?.message || "Unable to send notification.",
        });

    }

};