import { Request, Response } from "express";
import { Admin } from "../model/admin.model";
import bcrypt from "bcryptjs";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const {name, username, password, email} = req.body;
        if(!name || !username || !password || !email) {
            res.status(404).json({
                message: "Something is missing!",
                success: false
            });
            return;
        }

        const user = await Admin.findOne({ username });
        if(user) {
            res.status(403).json({
                message: "User Already Exists!",
                success: false,
            });
            return;
        }

        const emailId = await Admin.findOne({ email});
        if(emailId) {
            res.status(403).json({
                message: "Email Already Exists!",
                success: false,
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({
            name,
            email,
            username,
            password: hashedPassword
        });

        res.status(200).json({
            message: "Account Created🥳",
            success: true
        });
        return;

    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
        return;
    }
}