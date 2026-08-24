import {APP_NAME} from "../../../config/app.js";

export const testNotificationTemplate = ({
    name = "User",
}) => {

    return {
        title: APP_NAME,
        body: `Hello ${name}, this is a test notification.`,
        data: {
            type: "test_notification",
        },
    };

};