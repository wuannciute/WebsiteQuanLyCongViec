import { Router } from "express";
import { isAuth } from "../middleware/index.js";
import {
    register,
    login,
    refreshToken,
    searchUser,
    forgotPassword, // <-- THÊM MỚI
    resetPassword, // <-- THÊM MỚI
} from "../controllers/authCtrl.js";
import { updateProfile } from "../controllers/userCtrl.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
// router.get("/logout", logout);
router.post("/refreshToken", refreshToken);
router.get("/searchUser", isAuth, searchUser);
router.post("/profile/:id", isAuth, updateProfile);

// --- THÊM 2 ROUTE MỚI ---
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
// --- KẾT THÚC THÊM MỚI ---

export default router;