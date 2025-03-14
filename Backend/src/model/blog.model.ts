import mongoose from "mongoose";
import { Admin } from "./admin.model";

//predefined tags
const allowedTags = ["Politics", "Technology", "Health", "Sports", "Education", "Entertainment"];

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageURL: {
        type: String
    },
    tags: {
        type: [String], //array of tags
        enum: allowedTags,
        default: [] //allows creation of blog without any tags
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    }
}, { timestamps: true});

export const Blog = mongoose.model("Blog", blogSchema);