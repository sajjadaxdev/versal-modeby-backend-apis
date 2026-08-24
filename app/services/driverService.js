import knex from "../../db/knex.js";
import * as driverRepo from "../repositories/driverRepository.js";
import * as vehicleRepo from "../repositories/vehicleRepository.js";
import * as vehicleOwnerRepository from "../repositories/vehicleOwnersRepository.js";
import * as userRepository from "../repositories/userRepository.js";
import * as driverLocationRepo from "../repositories/driverLocationRepository.js";
import { driverLocationTransformer } from "../transformers/driverLocationTransformer.js";
import { driverTransformer, driversTransformer, singleDriversTransformer } from "../transformers/driverTransformer.js";
import { replaceFile, deleteFile } from "../helpers/fileHelper.js";
import { AppError } from "../utils/AppError.js";
import { basicInfoTransformer, driverIdentityTransformer, driverLicenseTransformer, driverVehicleTransformer } from "../transformers/driverTransformer.js";
import { driverApplicationApprovedTemplate, driverApplicationRejectedTemplate } from "../notifications/templates/driverNotification.js";
import { sendNotification } from "../services/notificationService.js";
import * as rideTrackService from "./rideTrackService.js";

export const getDrivers = async (filters) => {

    const result = await driverRepo.findAll(filters);

    return {
        success: true,
        message: "Drivers fetched successfully.",
        data: driversTransformer(result.rows),
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / result.limit),
        },
    };

};


export const getDriverById = async (id) => {

    const driver = await driverRepo.findById(id);

    if (!driver) {
        throw new AppError("Driver not found.", 404);
    }

    return {
        success: true,
        message: "Driver fetched successfully.",
        data: singleDriversTransformer(driver),
    };

};

export const register = async (data) => {

    
    const driver = await driverRepo.findByUserId(data.user_id);

    if (driver) {

        if (driver.verification_status === "submitted" || driver.verification_status === "under_review" || driver.verification_status === "approved") 
            throw new AppError("Vehicle cannot be changed after profile submission.", 409);

        const vehicle = await vehicleRepo.findByDriverId(driver.id);

        await vehicleRepo.updateById(vehicle.id, {
            vehicle_type_id: data.vehicle_type_id,
        });

        return {
            success: true,
            message: "Vehicle updated successfully.",
            data: driverTransformer(driver),
        };
    }

    return await knex.transaction(async (trx) => {

        const driver = await driverRepo.create({
            user_id: data.user_id,
            verification_status: "draft",
            rating: 5,
            is_online: false,
            is_available: false,
        }, trx);

        const vehicle = await vehicleRepo.create({
            driver_id: driver.id,
            vehicle_type_id: data.vehicle_type_id,
            is_verified: false,
            is_active: false,
        }, trx);

        // Single owner only
        await vehicleOwnerRepository.deleteByVehicleId(
            vehicle.id,
            trx
        );
        await vehicleOwnerRepository.create({
            vehicle_id: vehicle.id,
            owner_type: "driver",
            owner_id: driver.id,
            ownership_percentage: 100,
        }, trx);

        return {
            success: true,
            message: "Driver registered successfully.",
            data: driverTransformer(driver),
        };
    });

};

export const updateBasicInfo = async (data, file) => {

    const driver = await driverRepo.findByUserId(data.user_id);

    if (!driver) {
        throw new AppError("Driver not found.", 404);
    }

    const updateData = {
        verification_status:driver.verification_status === "rejected" ? "draft" : driver.verification_status,
        first_name: data.first_name,
        last_name: data.last_name,
        dob: data.dob,
    };

    if (file)
        updateData.personal_picture = replaceFile("driver", driver.personal_picture, file.filename);


    const updated = await driverRepo.updateById(driver.id, updateData);

    return {
        success: true,
        message: "Basic information updated successfully.",
        data: driverTransformer(updated),   
    };

};

export const updateIdentity = async (data, files) => {

    const driver = await driverRepo.findByUserId(data.user_id);

    if (!driver) {
        throw new AppError("Driver not found.", 404);
    }

    const updateData = {
        verification_status: driver.verification_status === "rejected" ? "draft" : driver.verification_status,
    };

    if (files?.cnic_front_side_picture?.length) {
        updateData.cnic_front_side_picture = replaceFile("driver", driver.cnic_front_side_picture, files.cnic_front_side_picture[0].filename);
    }

    if (files?.cnic_back_side_picture?.length) {
        updateData.cnic_back_side_picture = replaceFile("driver", driver.cnic_back_side_picture, files.cnic_back_side_picture[0].filename);
    }

    const updated = await driverRepo.updateById(
        driver.id,
        updateData
    );

    return {
        success: true,
        message: "Identity information updated successfully.",
        data: driverTransformer(updated),
    };

};

export const updateLicense = async (data, files) => {

    const driver = await driverRepo.findByUserId(data.user_id);

    if (!driver) {
        throw new AppError("Driver not found.", 404);
    }

    const updateData = {
        verification_status: driver.verification_status === "rejected" ? "draft" : driver.verification_status,
        license_number: data.license_number,
        license_expiration_date: data.license_expiration_date,
    };

    if (files?.license_front_side_picture?.length) {
        updateData.license_front_side_picture = replaceFile("driver", driver.license_front_side_picture, files.license_front_side_picture[0].filename);
    }

    if (files?.selfie_with_driver_license?.length) {
        updateData.selfie_with_driver_license = replaceFile("driver", driver.selfie_with_driver_license, files.selfie_with_driver_license[0].filename);
    }

    const updated = await driverRepo.updateById(
        driver.id,
        updateData
    );

    return {

        success: true,
        message: "License information updated successfully.",
        data: {
            ...driverTransformer(updated),
            next_step: "submit",
        }

    };

};

export const updateVehicle = async (data, file) => {

    const driver = await driverRepo.findByUserId(data.user_id);

    if (!driver)
        throw new AppError("Driver not found.", 404);

    // if (!file)
    //     throw new AppError("Vehicle image is required.", 422);

    const existingVehicle = await vehicleRepo.findByDriverId(driver.id);

    const vehicleData = {
        driver_id: driver.id,
        make: data.make,
        model: data.model,
        year: data.year,
        color: data.color,
        registration_number: data.registration_number,
        allow_city_ride: false,
        allow_intercity_ride: false,
        is_verified: false,
        is_active: false,
    };

    if (!existingVehicle) 
        throw new AppError("Driver vehicle not found.", 422);

    if(file)
        vehicleData.vehicle_image = replaceFile("vehicle", existingVehicle.vehicle_image, file.filename);

    const vehicle = await vehicleRepo.updateById(
        existingVehicle.id,
        vehicleData
    );

    return {
        success: true,
        message: "Vehicle information updated successfully.",
        data: vehicle,
    };

};

export const submit = async (data) => {

    const driver = await driverRepo.findByUserId(data.user_id);

    if (!driver) {
        throw new AppError("Driver not found.", 404);
    }

    if (driver.verification_status === "approved") {
        throw new AppError(
            "Driver is already approved.",
            400
        );
    }

    if (driver.verification_status === "under_review") {
        throw new AppError(
            "Driver profile is already under review.",
            400
        );
    }

    // -------------------------
    // Driver Required Fields
    // -------------------------

    const requiredDriverFields = [
        "first_name",
        "last_name",
        "dob",
        "personal_picture",
        "cnic_front_side_picture",
        "cnic_back_side_picture",
        "license_number",
        "license_front_side_picture",
        "selfie_with_driver_license",
        "license_expiration_date",
    ];

    for (const field of requiredDriverFields) {

        if (!driver[field]) {

            throw new AppError(
                `${field.replaceAll("_", " ")} is required.`,
                422
            );

        }

    }

    // -------------------------
    // Vehicle Check
    // -------------------------

    const vehicle = await vehicleRepo.findByDriverId(driver.id);

    if (!vehicle) {
        throw new AppError(
            "Vehicle information is required.",
            422
        );
    }

    const requiredVehicleFields = [
        "vehicle_type_id",
        "make",
        "model",
        "year",
        "color",
        "registration_number",
        "vehicle_image",
    ];

    for (const field of requiredVehicleFields) {

        if (!vehicle[field]) {

            throw new AppError(
                `${field.replaceAll("_", " ")} is required.`,
                422
            );

        }

    }

    // -------------------------
    // Submit
    // -------------------------

    const updated = await driverRepo.updateById(
        driver.id,
        {
            verification_status: "submitted",
        }
    );

    return {
        success: true,
        message: "Driver profile submitted successfully.",
        data: driverTransformer(updated),
    };

};

export const progress = async (userId) => {

    const driver = await driverRepo.findByUserId(userId);

    if (!driver) {

        return {
            success: true,
            data: {
                registered: false,
                verification_status: null,
                current_step: "choose_vehicle",
            },
        };

    }

    const vehicle = await vehicleRepo.findByDriverId(driver.id);

    if (driver.verification_status === "rejected") {

        return {
            success: true,
            data: {
                registered: false,
                verification_status: "rejected",
                current_step: "rejected",
                rejection_reason: driver.rejection_reason,
            },
        };

    }

    if (driver.verification_status === "submitted") {

        return {
            success: true,
            data: {
                registered: true,
                verification_status: "submitted",
                current_step: "submitted",
            },
        };

    }

    if (driver.verification_status === "under_review") {

        return {
            success: true,
            data: {
                registered: true,
                verification_status: "under_review",
                current_step: "under_review",
            },
        };

    }

    if (driver.verification_status === "approved") {

        return {
            success: true,
            data: {
                registered: true,
                verification_status: "approved",
                current_step: "dashboard",
            },
        };

    }

    if (!driver.first_name ||
        !driver.last_name ||
        !driver.personal_picture ||
        !driver.dob) {

        return {
            success: true,
            data: {
                registered: true,
                verification_status: driver.verification_status,
                current_step: "basic_info",
            },
        };

    }

    if (
        !driver.cnic_front_side_picture ||
        !driver.cnic_back_side_picture
    ) {

        return {
            success: true,
            data: {
                registered: true,
                verification_status: driver.verification_status,
                current_step: "identity",
            },
        };

    }

    if (
        !driver.license_number ||
        !driver.license_front_side_picture ||
        !driver.selfie_with_driver_license ||
        !driver.license_expiration_date
    ) {

        return {
            success: true,
            data: {
                registered: true,
                verification_status: driver.verification_status,
                current_step: "license",
            },
        };

    }

    if (
        !vehicle ||
        !vehicle.make ||
        !vehicle.model ||
        !vehicle.year ||
        !vehicle.color ||
        !vehicle.registration_number ||
        !vehicle.vehicle_image
    ) {

        return {
            success: true,
            data: {
                registered: true,
                verification_status: driver.verification_status,
                current_step: "vehicle",
            },
        };

    }

    return {
        success: true,
        data: {
            registered: true,
            verification_status: driver.verification_status,
            current_step: "submit",
        },
    };

};

export const getDriverDetails = async (userId, columns) => {
    return await driverRepo.getDriverDetails(userId, columns);
};

export const getVehicle = async (userId) => {

    const driver = await driverRepo.findByUserId(userId);

    if(!driver)
        return null;

    return await vehicleRepo.findByDriverId(driver.id);
};

export const getApplication = async (userId) => {

    const driver = await driverRepo.getDriverDetails(userId, [
        "id",
        "first_name",
        "last_name",
        "dob",
        "personal_picture",
        "cnic_front_side_picture",
        "cnic_back_side_picture",
        "license_number",
        "license_expiration_date",
        "license_front_side_picture",
        "selfie_with_driver_license",
        "verification_status",
    ]);

    if(!driver)
        throw new AppError("Driver not found.", 404);

    const vehicle = await vehicleRepo.findByDriverId(driver.id);

    return {
        "success": true,
        "data": {
            "basic_info": basicInfoTransformer(driver),
            "identity": driverIdentityTransformer(driver),
            "license": driverLicenseTransformer(driver),
            "vehicle": driverVehicleTransformer(vehicle),
            "status": driver.verification_status,
        }
    }

};

/*
|--------------------------------------------------------------------------
| Document Configuration
|--------------------------------------------------------------------------
*/
const DOCUMENT_CONFIG = {

    overall: {
        table: "drivers",
        statusColumn: "verification_status",
        label: "Verification Status",
    },

    personal_picture: {
        table: "drivers",
        statusColumn: "personal_picture_verification_status",
        label: "Personal picture",
    },

    cnic_front: {
        table: "drivers",
        statusColumn: "cnic_front_verification_status",
        label: "CNIC front",
    },

    cnic_back: {
        table: "drivers",
        statusColumn: "cnic_back_verification_status",
        label: "CNIC back",
    },

    license_front: {
        table: "drivers",
        statusColumn: "license_front_verification_status",
        label: "Driving license front",
    },

    license_selfie: {
        table: "drivers",
        statusColumn: "license_selfie_verification_status",
        label: "License selfie",
    },

    vehicle: {
        table: "vehicles",
        statusColumn: "vehicle_verification_status",
        label: "Vehicle",
    },

};


/*
|--------------------------------------------------------------------------
| Verify Driver Document
|--------------------------------------------------------------------------
*/
export const verifyDriverDocument = async (
    driverId,
    documentType,
    data,
    reviewedBy
) => {

    /*
    |--------------------------------------------------------------------------
    | Validate Document Type
    |--------------------------------------------------------------------------
    */

    const config = DOCUMENT_CONFIG[documentType];

    if (!config)
        throw new AppError(`Invalid document type: ${documentType}`, 400);

    /*
    |--------------------------------------------------------------------------
    | Find Driver
    |--------------------------------------------------------------------------
    */

    const driver = await driverRepo.findOnlyDriverById(driverId);


    if (!driver)
        throw new AppError("Driver not found.", 404);


    /*
    |--------------------------------------------------------------------------
    | Prevent Empty Reason For Rejection
    |--------------------------------------------------------------------------
    */

    if (data.status === "rejected" && !data.reason?.trim())
        throw new AppError(`Rejection reason is required for ${config.label}.`, 400);

    /*
    |--------------------------------------------------------------------------
    | Update Status + Create Review
    |--------------------------------------------------------------------------
    */

    const result = await driverRepo.updateDocumentVerification(
        driverId,
        config.table,
        config.statusColumn,
        data.status,
        documentType,
        data.reason,
        reviewedBy
    );

    const driverVehicle = await vehicleRepo.findDriverVehicle(driverId, ["id"]);

    if(!driverVehicle)
        throw new AppError(`Driver vehicle not found.`, 400);

    await vehicleRepo.update(driverVehicle.id, { 
        is_verified: data.status == 'approved',
        is_active: data.status == 'approved'
    });

    /*
    |--------------------------------------------------------------------------
    | Notify User
    |--------------------------------------------------------------------------
    */
    
    if (documentType?.toLowerCase() == "overall") {
        

        await driverRepo.updateById(driver.id, {
            rejection_reason: data.reason
        });

        const user = await userRepository.findById(driver.user_id);
        let notificationTemplate = null;

        if (data.status == 'rejected') {
            
            notificationTemplate = await driverApplicationRejectedTemplate({
                name: `${driver.first_name} ${driver.last_name}`,
                driverId: driver.id,
                reason: data.reason,
            });

        } else if (data.status == 'approved') {

            notificationTemplate = await driverApplicationApprovedTemplate({
                name: `${driver.first_name} ${driver.last_name}`,
                driverId: driver.id,
                reason: data.reason,
            });

        }

        if(user.fcm_id)
            await sendNotification({
                userId: user.id,
                token: user.fcm_id,
                ...notificationTemplate
            });

    }


    return {
        success: true,
        message: `${config.label} verification status updated successfully.`,
        data: {
            record: result.record,
            review: result.review,
        },

    };

};

export const updateOnlineStatus = async (userId, data) => {

    const { is_online } = data;

    const driver = await driverRepo.findDriverForOnlineStatusByUserId(userId);

    if (!driver) {
        throw new AppError("Driver not found.", 404);
    }

    if (is_online && driver.verification_status !== "approved") {
        const updated = await driverRepo.updateOnlineStatus(
            driver.id,
            false,
            false
        );
        return {
            success: false,
            message: "Only approved drivers can change online status.",
            data: updated,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Going Offline
    |--------------------------------------------------------------------------
    |
    | Driver offline hoga to automatically unavailable bhi hona chahiye.
    |
    */

    if (!is_online) {

        const updated = await driverRepo.updateOnlineStatus(
            driver.id,
            false,
            false
        );

        return {
            success: true,
            message: "Driver is now offline.",
            data: updated,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Going Online
    |--------------------------------------------------------------------------
    |
    | Online karte waqt available true karna zaroori nahi.
    | Driver online ho sakta hai lekin currently ride par busy ho.
    |
    */

    const updated = await driverRepo.updateOnlineStatus(
        driver.id,
        true,
        true
        // driver.is_available
    );

    return {
        success: true,
        message: "Driver is now online.",
        data: updated,
    };
};

export const getOnlineStatus = async (userId) => {


    const driver = await driverRepo.findDriverForOnlineStatusByUserId(userId);

    if (!driver) {
        throw new AppError("Driver not found.", 404);
    }

    return {
        success: true,
        message: "Driver is now online.",
        data: driver,
    };
};

/*
|--------------------------------------------------------------------------
| DRIVER LOCATION
|--------------------------------------------------------------------------
*/
export const updateLocation = async (
    userId,
    data
) => {

    
    const driver = await driverRepo.findByUserId(userId, ["id"]);

    if(!driver)
        throw new AppError("Driver not found.", 404);

    /*
    |--------------------------------------------------------------------------
    | Update Current Driver Location
    |--------------------------------------------------------------------------
    */
    const location = await driverLocationRepo.upsert({
        driver_id: driver.id,
        latitude: data.latitude,
        longitude: data.longitude,
        heading: data.heading,
        speed: data.speed,
    });

    /*
    |--------------------------------------------------------------------------
    | Record Active Ride Track
    |--------------------------------------------------------------------------
    |
    | Ride tracking business logic is handled by rideTrackService.
    |
    */
    await rideTrackService.recordTrack(
        driver.id,
        data
    );

    return {
        success: true,
        message: "Location updated successfully.",
        data: driverLocationTransformer(location),
    };
};

export const getLocation = async (userId) => {

    const driver = await driverRepo.findByUserId(userId, ["id"]);

    if(!driver)
        throw new AppError("Driver not found.", 404);
        

    const location = await driverLocationRepo.findByDriverId(driver.id);

    return {
        success: true,
        data: driverLocationTransformer(location),
    };
};

export const getDriverLocation = async (driverId) => {

    const location = await driverLocationRepo.findByDriverId(driverId);

    return {
        success: true,
        data: driverLocationTransformer(location),
    };
};
