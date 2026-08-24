import { messaging } from "../../config/firebase.js";
import { AppError } from "../utils/AppError.js";
import * as notificationRepo from "../repositories/notificationRepository.js";

/*
|--------------------------------------------------------------------------
| Get User Notifications
|--------------------------------------------------------------------------
*/

export const getUserNotifications = async (user_id, query = {}) => {

    const result = await notificationRepo.findByUser(
        user_id,
        query
    );

    return {
        success: true,
        message: "Notifications fetched successfully.",
        data: result.rows,
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: Math.ceil(
                result.total / result.limit
            ),
        },
    };

};


/*
|--------------------------------------------------------------------------
| Mark Notification As Read
|--------------------------------------------------------------------------
*/

export const markAsRead = async ({
    userId,
    notificationId,
}) => {

    const notification = await notificationRepo.markAsRead({
        userId,
        notificationId,
    });

    if (!notification)
        throw new AppError("Notification not found.", 404);

    return {
        success: true,
        message: "Notification marked as read.",
        data: notification,
    };

};


/*
|--------------------------------------------------------------------------
| Mark All Notifications As Read
|--------------------------------------------------------------------------
*/

export const markAllAsRead = async (userId) => {

    const count = await notificationRepo.markAllAsRead(
        userId
    );

    return {
        success: true,
        message: "Notifications marked as read.",
        data: {
            updated: count,
        },
    };

};


/*
|--------------------------------------------------------------------------
| Get Unread Count
|--------------------------------------------------------------------------
*/

export const getUnreadCount = async (userId) => {

    const count = await notificationRepo.unreadCount(
        userId
    );

    return {
        success: true,
        message: "Unread notification count fetched successfully.",
        data: {
            count,
        },
    };
};

/*
|--------------------------------------------------------------------------
| Convert Data To FCM Compatible Format
|--------------------------------------------------------------------------
|
| FCM data values must be strings.
|
*/

const normalizeData = (data = {}) => {

    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
            key,
            typeof value === "string" ?
            value :
            JSON.stringify(value),
        ])
    );

};

/*
|--------------------------------------------------------------------------
| Build Notification Message
|--------------------------------------------------------------------------
*/

const buildMessage = ({
    token,
    title,
    body,
    data = {},
    imageUrl = null,
}) => {

    const message = {
        token,
        notification: {
            title,
            body,
        },
        data: normalizeData(data),
    };


    /*
    |--------------------------------------------------------------------------
    | Android
    |--------------------------------------------------------------------------
    */

    message.android = {

        priority: "high",

        notification: {

            channelId: "default",

            ...(imageUrl ? {
                imageUrl
            } : {}),

        },

    };


    /*
    |--------------------------------------------------------------------------
    | iOS
    |--------------------------------------------------------------------------
    */

    message.apns = {

        payload: {

            aps: {

                sound: "default",

            },

        },

    };


    return message;

};


/*
|--------------------------------------------------------------------------
| Send To Single Device
|--------------------------------------------------------------------------
*/


/*
|-----------------------------------
|USAGE EXAMPLE
|-----------------------------------

1. SEND SIMPLE NOTIFICATION
---------------------------
await sendToToken({
    token: user.fcm_token,
    title: "Welcome",
    body: "Welcome to Moheby.",
});

2. SEND WITH NAVIFATION
------------------------
await sendToToken({
    token: user.fcm_token,
    title: "Document Rejected",
    body: "Your CNIC front was rejected.",
    data: {
        type: "driver_document_review",
        screen: "driver_document",
        driver_id: driverId,
        document_type: "cnic_front",
    },
});

*/


export const sendToToken = async ({
    token,
    title,
    body,
    data = {},
    imageUrl = null,
}) => {

    if (!token) {
        throw new AppError("FCM token is required.", 500);
    }


    const message = buildMessage({

        token,
        title,
        body,
        data,
        imageUrl,

    });


    return await messaging.send(message);

};


/*
|--------------------------------------------------------------------------
| Send To Multiple Devices
|--------------------------------------------------------------------------
*/

export const sendToTokens = async ({
    tokens,
    title,
    body,
    data = {},
    imageUrl = null,
}) => {

    if (!Array.isArray(tokens) || tokens.length === 0) {
        throw new AppError("FCM tokens are required.", 500);
    }


    const message = {

        notification: {
            title,
            body,
        },

        data: normalizeData(data),

        android: {

            priority: "high",

            notification: {

                channelId: "default",

                ...(imageUrl ? {
                    imageUrl
                } : {}),

            },

        },

        apns: {

            payload: {

                aps: {
                    sound: "default",
                },

            },

        },

    };


    const response = await messaging.sendEachForMulticast({

        tokens,

        ...message,

    });


    return response;

};

/*
|--------------------------------------------------------------------------
| Send To Topic
|--------------------------------------------------------------------------
*/

export const sendToTopic = async ({
    topic,
    title,
    body,
    data = {},
    imageUrl = null,
}) => {

    if (!topic) {
        throw new AppError("FCM topic is required.", 500);
    }


    const message = {

        topic,

        notification: {
            title,
            body,
        },

        data: normalizeData(data),

        android: {

            priority: "high",

            notification: {

                channelId: "default",

                ...(imageUrl ?
                    {
                        imageUrl
                    } :
                    {}),

            },

        },

        apns: {

            payload: {

                aps: {
                    sound: "default",
                },

            },

        },

    };


    return await messaging.send(message);

};


/*
|--------------------------------------------------------------------------
| Create + Send Notification
|--------------------------------------------------------------------------
|
| THIS IS THE MAIN REUSABLE METHOD.
|
| It:
|
| 1. Saves notification in database
| 2. Sends FCM notification
|
|--------------------------------------------------------------------------
*/

export const sendNotification = async ({
    userId,
    token,
    type,
    title,
    body,
    data = {},
    imageUrl = null,
}) => {

    /*
    |--------------------------------------------------------------------------
    | Save In-App Notification
    |--------------------------------------------------------------------------
    */

    const notification = await notificationRepo.create({
        userId,
        type,
        title,
        body,
        data,
    });


    /*
    |--------------------------------------------------------------------------
    | Send Push Notification
    |--------------------------------------------------------------------------
    */

    let fcmResponse = null;


    if (token) {

        fcmResponse = await sendToToken({
            token,
            title,
            body,
            data,
            imageUrl,
        });

    }


    return {
        success: true,
        notification,
        fcmResponse,
    };
};