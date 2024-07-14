import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/user.controller.js";

const routesUser = Router();

routesUser.get("/users", getAllUsers);
routesUser.get("/users/:id", getUserById);
routesUser.put("/users/:id", updateUserById);
routesUser.delete("/users/:id", deleteUser);

export default routesUser;
