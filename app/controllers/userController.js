
import * as userService from "../services/userService.js";

export const getUsers = async (req,res,next)=>{

    try{

        const result = await userService.getUsers(req.query);

        res.json(result);

    }

    catch(err){

        next(err);

    }

}

export const updateUserFcmToken = async (req, res, next)=>{

    try{

        const result = await userService.updateUserFcmToken(req.user.id, req.body.fcm_token);

        res.json(result);

    }

    catch(err){

        next(err);

    }

}