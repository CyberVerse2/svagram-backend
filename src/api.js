import { Router } from "express";
import userRouter from "./modules/user/user.router.js";
export const api = Router();

api.use("/users", userRouter);
