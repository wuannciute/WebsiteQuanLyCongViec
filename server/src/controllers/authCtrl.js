import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

const secretRfToken = process.env.RF_TOKEN;
const secretAcToken = process.env.AC_TOKEN;

// HÀM REGISTER ĐÃ THAY ĐỔI LUỒNG
export const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const findUser = await User.findOne({ username });
        if (findUser)
            return res
                .status(400)
                .json({ err: "Tên tài khoản đã có người sử dụng." });
        const findUser1 = await User.findOne({ email });
        if (findUser1)
            return res.status(400).json({ err: "Email đã có người sử dụng." });

        const err = validateRegister(username, password);
        if (err.length > 0) return res.status(400).json({ err: err });

        const hashPw = await bcrypt.hash(password, 12);
        const user = new User({ email, username, password: hashPw });
        
        await user.save();

        // Chỉ trả về tin nhắn thành công, không trả về token
        return res.json({
            msg: "Đăng kí tài khoản thành công. Vui lòng đăng nhập.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ err: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ email });
        if (!findUser)
            return res
                .status(400)
                .json({ err: "Email hoặc mật khẩu không chính xác." });

        const result = bcrypt.compareSync(password, findUser.password);
        if (!result)
            return res
                .status(400)
                .json({ err: "Tên tài khoản hoặc mật khẩu không chính xác." });
        
        const acToken = jwt.sign({ id: findUser._id }, secretAcToken, {
            expiresIn: "3d",
        });

        delete findUser._doc.password;

        return res.json({
            msg: "Đăng nhập tài khoản thành công",
            user: findUser,
            accessToken: acToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { accessToken } = req.body;
        jwt.verify(accessToken, secretAcToken, async (err, decoded) => {
            if (err) return res.status(400).json({ err: "Xin hãy đăng nhập." });
            const { id } = decoded;
            const findUsername = await User.findById(id);
            if (!findUsername)
                return res.status(400).json({ err: "Xin hãy đăng nhập." });

            return res.json({ accessToken: accessToken, user: findUsername });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: error.message });
    }
};

export const searchUser = async (req, res) => {
    try {
        const { search } = req.query;
        const findUsers = await User.find({
            username: { $regex: `^${search}.*` },
        }).select({ username: 1, avatar: 1 });
        return res.json({ searchUsers: findUsers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: error.message });
    }
};

function validateRegister(username, password) {
    const err = [];
    if (username.length > 25) {
        err.push("Tên tài khoản không được dài quá 25 kí tự");
    } else if (username.length < 6) {
        err.push("Tên tài khoản không được ngắn hơn 6 kí tự");
    }

    if (password.length > 25) {
        err.push("Mật khẩu không được dài quá 25 kí tự");
    } else if (password.length < 6) {
        err.push("Mật khẩu khoản không được ngắn hơn 6 kí tự");
    }
    return err;
}


// =========================================================
// CÁC HÀM CHO CHỨC NĂNG QUÊN MẬT KHẨU (ĐÃ SỬA LỖI)
// =========================================================

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
    };

    await transporter.sendMail(mailOptions);
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ msg: "Nếu email tồn tại, một mã khôi phục đã được gửi." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        await sendEmail({
            to: user.email,
            subject: "Mã khôi phục mật khẩu",
            text: `Mã khôi phục mật khẩu của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút.`,
        });
        
        await User.updateOne(
            { _id: user._id },
            {
                passwordResetOTP: otp,
                passwordResetExpires: otpExpires,
            }
        );

        return res.json({ msg: "Một mã khôi phục đã được gửi tới email của bạn." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ err: "Đã xảy ra lỗi, vui lòng thử lại." });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        const user = await User.findOne({
            email,
            passwordResetOTP: otp,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ err: "Mã OTP không hợp lệ hoặc đã hết hạn." });
        }

        const hashPw = await bcrypt.hash(password, 12);

        await User.updateOne(
            { _id: user._id },
            {
                password: hashPw,
                $unset: {
                    passwordResetOTP: 1, 
                    passwordResetExpires: 1 
                }
            }
        );

        res.json({ msg: "Cập nhật mật khẩu thành công." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Đã có lỗi xảy ra." });
    }
};