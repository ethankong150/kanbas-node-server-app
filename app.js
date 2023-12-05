import express from "express";
import session from "express-session";
import CourseRoutes from "./Courses/routes.js";
import ModuleRoutes from "./Modules/routes.js";
import UserRoutes from "./users/routes.js";

import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

try {
    mongoose.connect("mongodb://127.0.0.1:27017/kanbas");
    console.log("Connected to MongoDB");
} catch (error) {
    console.log(error);
}
const app = express();
app.use(cors(
    { credentials: true,
        origin: process.env.FRONTEND_URL || "http://localhost:3000"
    }
));

const sessionOptions = {
    secret: "any string",
    resave: false,
    saveUninitialized: false,
  };
if (process.env.NODE_ENV !== "development") {
sessionOptions.proxy = true;
sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
};
}
app.use(session(sessionOptions));
  
app.use(express.json());

UserRoutes(app);
ModuleRoutes(app);
CourseRoutes(app);

// app.listen(process.env.PORT || 4000, () => console.log("Server running..."));
app.listen(4000, () => console.log("Server running..."));