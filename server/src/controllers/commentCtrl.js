import { Comment, Task } from "../models/index.js";

export const createComment = async (req, res) => {
    try {
        // Lấy content từ req.body.data
        const { content } = req.body.data;

        // Kiểm tra xem content có rỗng không
        if (!content || content.trim() === "") {
            return res.status(400).json({ err: "Nội dung bình luận không được để trống." });
        }

        const newComment = new Comment({
            content,
            task: req.params.idTask,
            user: req.user._id,
        });

        await newComment.save();

        let findComment = await Comment.findOne({
            _id: newComment._id,
        }).populate({
            path: "user",
            select: { avatar: 1, username: 1 },
        });

        const updateTask = await Task.findOneAndUpdate(
            { _id: req.params.idTask },
            { $push: { comments: newComment._id } },
            { returnDocument: "after" }
        );

        return res.status(200).json({
            task: updateTask,
            comment: findComment,
        });
    } catch (error) {
        console.log("SERVER: Đã có lỗi xảy ra trong khối catch:", error);
        res.status(500).json({ err: error.message });
    }
};

// Nếu bạn có các hàm khác trong file này, hãy giữ nguyên chúng ở dưới đây...