import express from "express";
import { login, logout, register } from "../controller/admin.controller";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("").get(logout);

export default router;