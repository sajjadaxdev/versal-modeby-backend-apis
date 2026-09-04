import * as driverService from "../services/driverService.js";
import { basicInfoTransformer, driverIdentityTransformer, driverLicenseTransformer, driverVehicleTransformer } from "../transformers/driverTransformer.js";

export const index = async (req, res, next) => {

    try {

        const response = await driverService.getDrivers(req.query);

        return res.json(response);

    } catch (error) {

        next(error);

    }

};

export const show = async (req, res, next) => {

    try {

        const response = await driverService.getDriverById(req.params.id);

        return res.json(response);

    } catch (error) {

        next(error);

    }

};


export const register = async (req, res, next) => {

    try {

        const result = await driverService.register(req.body);

        return res.json(result);

    } catch (e) {

        next(e);

    }

};

export const updateBasicInfo = async (req, res, next) => {

    try {

        const result = await driverService.updateBasicInfo(
            req.body,
            req.file
        );

        return res.json(result);

    } catch (e) {

        next(e);

    }

};

export const updateIdentity = async (req, res, next) => {

    try {

        const result = await driverService.updateIdentity(
            req.body,
            req.files
        );

        return res.json(result);

    } catch (e) {

        next(e);

    }

};

export const updateLicense = async (req, res, next) => {

    try {

        const result = await driverService.updateLicense(
            req.body,
            req.files
        );

        return res.json(result);

    } catch (e) {

        next(e);

    }

};

export const updateVehicle = async (req, res, next) => {

    try {

        const result = await driverService.updateVehicle(
            req.body,
            req.file
        );

        return res.json(result);

    } catch (e) {

        next(e);

    }

};

export const submit = async (req, res, next) => {

    try {

        const result = await driverService.submit(req.body);

        return res.json(result);

    } catch (e) {

        next(e);

    }

};

export const progress = async (req, res, next) => {

    try {

        const result = await driverService.progress(
            req.user.id,
        );

        return res.json(result);

    } catch (e) {

        next(e);

    }

};

export const getBasicInfo = async (req, res, next) => {
    try {

        const data = await driverService.getDriverDetails(
            req.user.id,
            [
                "first_name",
                "last_name",
                "dob",
                "personal_picture",
            ]
        );

        return res.json({
            success: true,
            message: "Basic information fetched successfully.",
            data: basicInfoTransformer(data)
        });

    } catch (error) {
        next(error);
    }
};

export const getIdentity = async (req, res, next) => {
    try {

        const data = await driverService.getDriverDetails(
            req.user.id,
            [
                "cnic_front_side_picture",
                "cnic_back_side_picture",
            ]
        );
        
        return res.json({
            success: true,
            message: "Identity information fetched successfully.",
            data: driverIdentityTransformer(data)
        });


    } catch (error) {
        next(error);
    }
};

export const getLicense = async (req, res, next) => {
    try {

        const data = await driverService.getDriverDetails(
            req.user.id,
            [
                "license_number",
                "license_expiration_date",
                "license_front_side_picture",
                "selfie_with_driver_license",
            ]
        );
                
        return res.json({
            success: true,
            message: "License information fetched successfully.",
            data: driverLicenseTransformer(data)
        });

    } catch (error) {
        next(error);
    }
};

export const getVehicle = async (req, res, next) => {
    try {

        const result = await driverService.getVehicle(req.user.id);
        
        return res.json({
            success: true,
            message: "Vehicle information fetched successfully.",
            data: driverVehicleTransformer(result)
        });

    } catch (error) {
        next(error);
    }
};

export const getApplication = async (req, res, next) => {
    try {

        const application = await driverService.getApplication(req.user.id);

        return res.json(application);

    } catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| Verify Driver Document
|--------------------------------------------------------------------------
*/

export const verifyDocument = async (req, res, next) => {

    try {

        const response = await driverService.verifyDriverDocument(
            req.params.driverId,
            req.params.documentType,
            req.body,
            req.user?.id
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }

};

export const updateOnlineStatus = async (req, res, next) => {
    try {

        const response = await driverService.updateOnlineStatus(
            req.user.id,
            req.body
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }
};

export const getOnlineStatus = async (req, res, next) => {
    try {

        const response = await driverService.getOnlineStatus(
            req.user.id,
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }
};

export const updateLocation = async (req, res, next) => {

    try {

        const response = await driverService.updateLocation(
            req.user.id,
            req.body
        );

        return res.json(response);

    } catch (error) {
        next(error);
    }
};

export const getMyLocation = async (req, res, next) => {

    try {

        const response = await driverService.getLocation(req.user.id);

        return res.json(response);

    } catch (error) {
        next(error);
    }
};

export const getDriverLocation = async (req, res, next) => {

    try {

        const response = await driverService.getDriverLocation(
            req.params.driver_id
        );

        return res.json(response);

    } catch (error) {
        next(error);
    }
};

export const getSession = async (req, res, next) => {

    try {

        const response = await driverService.getSession(req.user.id);

        return res.json(response);

    } catch (error) {

        next(error);
    }
};