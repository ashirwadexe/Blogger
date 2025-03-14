import { Request, Response } from "express";
import { Blog } from "../model/blog.model";

export const createBlog = async (req: Request, res: Response):Promise<void> => {
    try {
        const { title, content, imageURL, tags, userId} = req.body;
        
        if(!title) {
            res.status(404).json({
                message: "Title is missing!",
                success: false
            });
            return;
        };
        if(!content) {
            res.status(404).json({
                message: "Content is missing!",
                success: false
            });
            return;
        };
        if(!userId) {
            res.status(404).json({
                message: "User is missing!",
                success: false
            });
            return;
        };

        //here we will allow only valid tags to get store
        const allowedTags = ["Politics", "Technology", "Health", "Sports", "Education", "Entertainment"];
        //we will include only the allowed tags and if try to add random tag it will get filter out
        //prevent storage of undifined or null tags
        const validTags = tags?.filter((tag: string) => allowedTags.includes(tag)) || [];

        //creating a new blog here and storing it to the database
        const newBlog = Blog.create({
            title,
            content,
            imageURL,
            tags: validTags,
            userId
        });

        res.status(200).json({
            message: "Blog Created🥳",
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

export const getAllBlogs = async (req: Request, res: Response):Promise<void> => {
    try {
        //fetch blogs from the DB
        const blogs = await Blog.find().sort({createdAt: -1}); //sort by latest first blog

        res.status(200).json({
            success: true,
            count: blogs.length,
            blogs
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


export const updateBlog = async (req: Request, res: Response):Promise<void> => {
    try {
        const { id } = req.params;
        const { title, content, imageURL, tags} = req.body;

        //allowed tags
        const allowedTags = ["Politics", "Technology", "Health", "Sports", "Education", "Entertainment"];
        const validTags = tags.filter((tag: string) => allowedTags.includes(tag)) || [];

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, content, imageURL, tags:validTags},
            { new: true, runValidators: true}
        );

        if(!updateBlog) {
            res.status(404).json({
                message: "Blog not found🤦🏻‍♂",
                success: false
            });
            return;
        };

        res.status(200).json({
            message: "Blog Updated✨",
            success: true,
            Blog: updatedBlog
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

export const deleteBlog = async (req: Request, res: Response):Promise<void> => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const blog = await Blog.findById(id);
        if(!blog) {
            res.status(404).json({
                message: "Blog not found",
                success: false
            });
            return;
        }

        await Blog.findByIdAndDelete(id);

        res.status(200).json({
            message: "Blog Deleted!",
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
