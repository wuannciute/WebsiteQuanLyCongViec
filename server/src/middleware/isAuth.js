import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export default async function isAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    // Kiểm tra xem header có tồn tại không và có dạng Bearer không
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ err: "Xác thực không hợp lệ, không tìm thấy token." });
    }

    const token = authHeader.split(" ")[1]; // Lấy token sau "Bearer "

    try {
        const decoded = jwt.verify(token, process.env.AC_TOKEN); // Giải mã token
        const { id } = decoded;

        const findUsername = await User.findById(id).select("-password");

        if (!findUsername) {
            return res.status(404).json({ err: "Không tìm thấy người dùng." });
        }

        req.user = findUsername;
        next();
    } catch (err) {
        return res.status(403).json({ err: "Token không hợp lệ hoặc đã hết hạn." });
    }
}
