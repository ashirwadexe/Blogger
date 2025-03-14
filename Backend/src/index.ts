import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./utils/db";
import cookieParser from "cookie-parser";
const app = express();
import adminRouter from "./routes/admin.route"
import blogRouter from "./routes/blog.route"

dotenv.config();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

//apis
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/blog", blogRouter);

app.listen(PORT, () => {
    connectDB();
    console.log(`App is listening on PORT: ${PORT}`);
});