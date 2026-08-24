import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { generateOTP } from "../utils/otp.js";
import * as userRepository from "../repositories/userRepository.js";
import * as riderRepo from "../repositories/riderRepository.js";
import { verifyGoogleToken } from "../services/googleAuthService.js";
import {transformUser} from '../transformers/userTransformer.js';
import {getUserRolesAndPermissions} from '../repositories/rolePermissionRepository.js';

import * as roleRepository from "../repositories/roleRepository.js";
import * as userRoleRepository from "../repositories/userRoleRepository.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("🚨 JWT_SECRET is missing! Set it in your .env file or server environment.");
}

// Unused
export const register = async (data) => {

    const { username, password } = data;

    const existingUser = await userRepository.findByUsername(username);

    if (existingUser) {
        throw new AppError("User already exists.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await userRepository.create({
        username,
        password: hashedPassword
    });
};

export const login = async (data) => {

    const { username, password } = data;

    const user = await userRepository.findByUsername(username);

    if (!user)
        throw new AppError("User not found.", 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        throw new AppError("Invalid username or password.", 400);

    const token = jwt.sign({id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
    const access = await getUserRolesAndPermissions(user.id);
    
    return { 
        success: true,
        message: "Login successful",
        data: {
            token,
            user: {
                ...transformUser(user),
                ...access,
            },
        }
    };
}

// Unused End

export const sendOTP = async (data) => {

    let getUser = await userRepository.getOrCreate(data);

    if (!getUser.success) {
        throw new AppError("Unable to register, Please try again.", 400);
    }

    // ==================================================
    // Default Rider Role Assign
    // ==================================================

    const existingRoles = await userRoleRepository.findRolesByUser(getUser.user.id);

    if (existingRoles.length === 0) {

        const riderRole = await roleRepository.findBySlug("rider");

        if (!riderRole) {
            throw new AppError("Default rider role not found.", 500);
        }

        await userRoleRepository.assign(getUser.user.id, [riderRole.id]);
    }

    // ==================================================
    // Generate OTP
    // ==================================================

    const otp = generateOTP();
    await userRepository.updateOtp(getUser.user.id, otp);

    // const roles = await userRoleRepository.findRolesByUser(user.id);

    // rider Profile
    const riderProfile = await riderRepo.findByUserId(getUser.user.id);
    if(!riderProfile) {
        await riderRepo.create({
            user_id: getUser.user.id,
            preferred_payment: "cash",
        });
    }

    return { 
        success: true,
        message: "OTP send successful", 
        isNewUser: getUser.isNewUser,
        user: getUser.user,
        // user: {
        //     ...user,
        //     roles,
        // },
    };
}

export const verifyOTP = async (data) => {
    const { phone, otp } = data;

    if (!phone || !otp) {
        throw new AppError("Phone and OTP required", 400);
    }

    const user = await userRepository.findByPhone(phone);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (!user.otp_code) {
        throw new AppError("OTP not requested", 400);
    }

    if (String(user.otp_code) !== String(otp)) {
        throw new AppError("Invalid OTP", 400);
    }

    // optional expiry check
    //   if (user.otp_expires_at && new Date(user.otp_expires_at) < new Date()) {
    //     throw new AppError("OTP expired", 400);
    //   }

    // clear OTP after success
    await userRepository.updateOtp(user.id, null);

    const token = jwt.sign({ 
        id: user.id, 
        phone: user.phone,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        success: true,
        message: "OTP verified successfully",
        token,
        user: transformUser(user)
    };
};

export const updateUsername = async (data) => {
  const { userId, name } = data;

  if (!userId || !name) {
    throw new AppError("UserId and name are required", 400);
  }

  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await userRepository.updateUsername(userId, name);

  const updatedUser = await userRepository.findById(userId);

  return {
    success: true,
    message: "Username updated successfully",
    user: updatedUser,
  };
};

export const validateToken = async (req) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return {
            success: false,
            valid: false,
            message: "Token missing"
        };
    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET);

        return {
            success: true,
            valid: true,
            user: {
                id: decoded.id,
                phone: decoded.phone,
            },
        };

    } catch (err) {

        return {
            success: false,
            valid: false,
            message: err.message,
        };

    }
};

export const googleLogin = async (data) => {

    const { idToken, fcmToken } = data;

    const googleUser = await verifyGoogleToken(idToken);
    let user = await userRepository.findByEmail(googleUser.email);

    if (!user) {
        user = await userRepository.createGoogleUser({
            fcm_id: fcmToken,
            name: googleUser.name,
            email: googleUser.email,
            googleId: googleUser.googleId,
            avatar: googleUser.picture,
        });
    }else {
        if(fcmToken)
            await userRepository.updateUserFcmToken(user.id, fcmToken);
    }


    const riderProfile = await riderRepo.findByUserId(user.id);
    if(!riderProfile) {
        await riderRepo.create({
            user_id: user.id,
            preferred_payment: "cash",
        });
    }

    const token = jwt.sign({
        id: user.id,
        email: user.email,
    },JWT_SECRET,{ 
        expiresIn: "7d" 
    });

  return {
    success: true,
    message: "Google login successful",
    token,
    user,
  };
  
};