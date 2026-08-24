import { formatDatabaseDate, formatDateTime } from "../helpers/dateHelper.js";
import { getBaseUrl } from "../helpers/fileHelper.js";

const imageBaseUrl = getBaseUrl();

const mapDriver = (driver = {}) => {

    return {
        driver_id: driver.id,
        verification_status: driver.verification_status,
        rating: Number(driver.rating),
        is_online: Boolean(driver.is_online),
        is_available: Boolean(driver.is_available),
        created_at: formatDateTime(driver.created_at),
        updated_at: formatDateTime(driver.updated_at),

        personal_information: {
            first_name: driver.first_name,
            last_name: driver.last_name,
            dob: formatDatabaseDate(driver.dob),
            personal_picture: driver.personal_picture,
            personal_picture_verification_status: driver.personal_picture_verification_status,
            personal_picture_full: `${imageBaseUrl}/${driver.personal_picture}`,

            personal_picture_review_action: driver.personal_picture_review_action,
            personal_picture_review_reason: driver.personal_picture_review_reason,
        },

        identity: {
            cnic_front_side_picture: driver.cnic_front_side_picture,
            cnic_front_verification_status: driver.cnic_front_verification_status,
            cnic_front_side_picture_full: `${imageBaseUrl}/${driver.cnic_front_side_picture}`,

            cnic_front_review_action: driver.cnic_front_review_action,
            cnic_front_review_reason: driver.cnic_front_review_reason,

            cnic_back_side_picture: driver.cnic_back_side_picture,
            cnic_back_verification_status: driver.cnic_back_verification_status,
            cnic_back_side_picture_full: `${imageBaseUrl}/${driver.cnic_back_side_picture}`,

            cnic_back_review_action: driver.cnic_back_review_action,
            cnic_back_review_reason: driver.cnic_back_review_reason,
        },

        license:{
            license_number: driver.license_number,
            license_front_side_picture: driver.license_front_side_picture,
            license_front_verification_status: driver.license_front_verification_status,
            license_front_side_picture_full: `${imageBaseUrl}/${driver.license_front_side_picture}`,
            selfie_with_driver_license: driver.selfie_with_driver_license,
            license_selfie_verification_status: driver.license_selfie_verification_status,
            selfie_with_driver_license_full: `${imageBaseUrl}/${driver.selfie_with_driver_license}`,
            license_expiration_date: formatDatabaseDate(driver.license_expiration_date),

            license_front_review_action: driver.license_front_review_action,
            license_front_review_reason: driver.license_front_review_reason,

            license_selfie_review_action: driver.license_selfie_review_action,
            license_selfie_review_reason: driver.license_selfie_review_reason,
        },

        user: {
            user_id: driver.user_id,
            username: driver.username,
            email: driver.email,
            phone: driver.phone,
        },

        vehicle: {
            vehicle_id: driver.vehicle_id,
            vehicle_verification_status: driver.vehicle_verification_status,
            vehicle_make: driver.vehicle_make,
            vehicle_model: driver.vehicle_model,
            vehicle_year: driver.vehicle_year,
            vehicle_color: driver.vehicle_color,
            vehicle_image: driver.vehicle_image,
            vehicle_image_full: driver.vehicle_image ? `${imageBaseUrl}/${driver.vehicle_image}` : null,
            vehicle_registration_number: driver.vehicle_registration_number,
            vehicle_type: driver.vehicle_type,
            is_vehicle_verified: driver.is_vehicle_verified,
            is_vehicle_active: driver.is_vehicle_active,
            vehicle_allow_city_ride: driver.vehicle_allow_city_ride,
            vehicle_allow_intercity_ride: driver.vehicle_allow_intercity_ride,

            vehicle_review_action: driver.vehicle_review_action,
            vehicle_review_reason: driver.vehicle_review_reason,
        }
    };
};


export const driversTransformer = (drivers = []) => drivers.map(mapDriver);
export const singleDriversTransformer = (driver) => mapDriver(driver);

export const driverTransformer = (driver) => {

    if (!driver) return null;

    return {
        id: driver.id,
        user_id: driver.user_id,
        first_name: driver.first_name,
        last_name: driver.last_name,
        dob: formatDatabaseDate(driver.dob),
        personal_picture: driver.personal_picture,
        cnic_front_side_picture: driver.cnic_front_side_picture,
        cnic_back_side_picture: driver.cnic_back_side_picture,
        license_number: driver.license_number,
        license_front_side_picture: driver.license_front_side_picture,
        selfie_with_driver_license: driver.selfie_with_driver_license,
        license_expiration_date: driver.license_expiration_date,
        verification_status: driver.verification_status,
        rating: Number(driver.rating),
        is_online: Boolean(driver.is_online),
        is_available: Boolean(driver.is_available),
        created_at: driver.created_at,
        updated_at: driver.updated_at,

    };

};

export const basicInfoTransformer = (driver) => {

    if (!driver) return null;

    return {
        first_name: driver.first_name,
        last_name: driver.last_name,
        dob: formatDatabaseDate(driver.dob),
        personal_picture: driver.personal_picture ? `${imageBaseUrl}/${driver.personal_picture}` : null,
    };

};

export const driverIdentityTransformer = (driver) => {

    if (!driver) return null;

    return {
        cnic_front_side_picture: driver.cnic_front_side_picture ? `${imageBaseUrl}/${driver.cnic_front_side_picture}` : null,
        cnic_back_side_picture: driver.cnic_back_side_picture ? `${imageBaseUrl}/${driver.cnic_back_side_picture}`: null,
    };

};

export const driverLicenseTransformer = (driver) => {

    if (!driver) return null;

    return {
        license_number: driver.license_number,
        license_expiration_date: formatDatabaseDate(driver.license_expiration_date),
        license_front_side_picture: driver.license_front_side_picture ? `${imageBaseUrl}/${driver.license_front_side_picture}` : null,
        selfie_with_driver_license: driver.selfie_with_driver_license ? `${imageBaseUrl}/${driver.selfie_with_driver_license}` : null,
    };

};

export const driverVehicleTransformer = (vehicle) => {

    if (!vehicle) return null;

    return {
        id: vehicle.id,
        driver_id: vehicle.driver_id,
        vehicle_type_id: vehicle.vehicle_type_id,
        vehicle_type: vehicle.vehicle_type,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        registration_number: vehicle.registration_number,
        vehicle_image: vehicle.vehicle_image ? `${imageBaseUrl}/${vehicle.vehicle_image}` : null,
        is_verified: Number(vehicle.is_verified),
        is_active: Number(vehicle.is_active),
        allow_city_ride: Number(vehicle.allow_city_ride),
        allow_intercity_ride: Number(vehicle.allow_intercity_ride),
    };

};