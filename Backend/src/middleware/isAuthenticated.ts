import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        const token = req.cookies.token;
        if(!token) {
            res.status(404).json({
                message: "Unauthorised User!!!",
                success: false
            });
            return;
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY as string) as jwt.JwtPayload;
        if(!decode) {
            res.status(404).json({
                message: "Invalid Token!",
                success: false
            });
            return;
        }

        req.id = decode.userId;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
        return;
    }
}