import * as authService from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    
    const result = await authService.register(req.body);

    res.json(result);

  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {

    const result = await authService.login(req.body);

    res.json(result);

  } catch (err) {
    next(err);
  }
};

export const sendOTP = async (req, res, next) => {
  try {

    const result = await authService.sendOTP(req.body);

    res.json(result);

  } catch (err) {
    next(err);
  }
}

export const verifyOTP = async (req, res, next) => {
  try {

    const result = await authService.verifyOTP(req.body);

    res.json(result);

  } catch (err) {
    next(err);
  }
}

export const updateUsername = async (req, res, next) => {
  try {
    const result = await authService.updateUsername(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const validateToken = async (req, res, next) => {
  try {

    const result = await authService.validateToken(req);

    res.json(result);

  } catch (err) {
    next(err);
  }
};

export const googleLogin = async (req, res, next) => {
  try {

    const result = await authService.googleLogin(req.body);

    res.json(result);

  } catch (err) {
    next(err);
  }
};