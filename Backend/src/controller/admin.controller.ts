import { Request, Response } from "express";
import { Admin } from "../model/admin.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
                message: "Username Already Exists!",
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
};

//login
export const login = async (req: Request, res: Response):Promise<void> => {
    try {
        const { email, password} = req.body;
        if(!email || !password) {
            res.status(404).json({
                message: "Enter all details🤓",
                success: false
            });
            return;
        }

        const user = await Admin.findOne({email});
        if(!user) {
            res.status(404).json({
                message: "User doesn't exist🤦🏻‍♂",
                success: false
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            res.status(403).json({
                message: "Incorrect Password🤭",
                success: false
            });
            return;
        }

        const tokenData = {
            userId: user.id
        };

        const token = jwt.sign(tokenData, process.env.SECRET_KEY as string, {
            expiresIn: '1d',
        });

        res.status(200).cookie("token", token, {
            maxAge: 1*24*60*60*1000,
            httpOnly: true,
            sameSite: 'strict'
        })
        .json({
            message: "Logged In🥳",
            success: true
        });
        return;

    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
        return;
    }
};

export const logout = async (req: Request, res: Response):Promise<void> => {
    try {
        res.status(200).cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: 'strict'
        })
        .json({
            message: "Logged Out🙁",
            success: true
        });
        return;
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
        return;
    }
}