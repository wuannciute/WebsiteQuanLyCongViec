import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            maxlength: 25,
            minlength: 6,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        // --- THÊM MỚI ---
        passwordResetOTP: {
            type: String,
        },
        passwordResetExpires: {
            type: Date,
        },
        // --- KẾT THÚC THÊM MỚI ---
        avatar: {
            type: String,
            default:
                "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
        },
        projects: [
            {
                type: mongoose.Types.ObjectId,
                ref: "projects",
                default: [],
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("users", userSchema);