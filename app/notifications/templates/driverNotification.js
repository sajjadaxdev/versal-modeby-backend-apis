import { APP_NAME } from "../../../config/app.js";
import { DRIVER_APPLICATION_APPROVE, DRIVER_APPLICATION_REJECT, RIDE_REQUEST } from "../notificationTypes.js";

export const driverApplicationApprovedTemplate = async ({
    name = "Driver",
    driverId = null,
}) => {

    return {
        title: "Application Approved",
        body: `Congratulations ${name}! Your driver application has been approved. You can now go online and start accepting rides.`,
        type: DRIVER_APPLICATION_APPROVE,
        data: {
            type: DRIVER_APPLICATION_APPROVE,
            status: "approved",
            driver_id: driverId ? String(driverId) : "",
        },
    };
};

export const driverApplicationRejectedTemplate = async ({
    name = "Driver",
    driverId = null,
    reason = "",
}) => {

    return {
        title: "Application Rejected",
        body: `Unfortunately ${name}, your driver application has been rejected. Please review the rejection reason and make the required changes before submitting again.`,
        type: DRIVER_APPLICATION_REJECT,
        data: {
            type: DRIVER_APPLICATION_REJECT,
            status: "rejected",
            driver_id: driverId ? String(driverId) : "",
            reason: reason || "",
        },
    };
};

export const rideRequestTemplate = async ({
    rideId = null,
    requestId = null,
}) => {

    return {
        title: "New Ride Request",
        body: "You have received a new ride request.",
        type: RIDE_REQUEST,

        data: {
            type: RIDE_REQUEST,
            ride_id: rideId ? String(rideId) : "",
            request_id: requestId ? String(requestId) : "",
        },
    };
};