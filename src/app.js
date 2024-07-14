import express from "express";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import routesAuth from "./routes/auth.routes.js";
import routesUser from "./routes/user.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();
console.log(process.env.FRONTEND_URL);

export const app = express();
export const prisma = new PrismaClient();

// Configure the app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Define the routes
app.use("/api/v1", routesAuth);
app.use("/api/v1", routesUser);
