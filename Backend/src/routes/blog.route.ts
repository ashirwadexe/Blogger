import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { createBlog, deleteBlog, getAllBlogs, updateBlog } from "../controller/blog.controller";
const router = express.Router();

router.route("/create").post(isAuthenticated, createBlog);
router.route("/blogs").get(getAllBlogs);
router.route("/blog/:id").put(isAuthenticated, updateBlog);
router.route("/blog/:id").delete(isAuthenticated, deleteBlog);

export default router;