import { Router } from "express";
import authRouter from "./authRouter.js";
import projectRouter from "./projectRouter.js";

const router = Router();

// mount trực tiếp vì đã có /api ở index.js
router.use("/", authRouter);
router.use("/", projectRouter);

export default router;
