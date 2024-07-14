import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyUser,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validator.schema.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const routesAuth = Router();

routesAuth.post(
  "/auth/register",
  [validateSchema(registerSchema)],
  registerUser
);
routesAuth.post("/auth/login", validateSchema(loginSchema), loginUser);
routesAuth.get("/auth/logout", logoutUser);
// validate token
routesAuth.get("/auth/verify", verifyUser);
// logout
routesAuth.get("/auth/logout", logoutUser);

export default routesAuth;
