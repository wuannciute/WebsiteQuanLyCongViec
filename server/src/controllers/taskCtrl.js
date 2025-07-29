import { Task, Column, Comment, Work } from "../models/index.js";

export const createTask = async (req, res) => {
    try {
        const { title, dec, tag, color, column, project } = req.body;

        const findColumn = await Column.findById(column);
        if (!findColumn)
            return res.status(400).json({ err: "Id cột không chính xác" });
        const newTask = new Task({
            title,
            dec,
            tag,
            color,
            column,
            project,
        });
        newTask.members.push(req.user._id);
        await newTask.save();
        findColumn.tasks.push(newTask._id);
        findColumn.taskOrder.push(newTask._id);
        await findColumn.save();
        const task = await Task.findOne({ _id: newTask._id }).populate({
            path: "members",
            select: { avatar: 1, username: 1, email: 1 },
        });
        return res.json({
            msg: "Tạo task thành công",
            task: task,
        });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

export const getTaskByID = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.idTask })
            .populate("works")
            .populate({
                path: "members",
                select: { avatar: 1, username: 1, email: 1 },
            })
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: { avatar: 1, username: 1 },
                },
            });

        return res.status(200).json({ msg: "Lấy Dữ liệu thành công.", task });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const updateTask = await Task.findOneAndUpdate(
            { _id: req.params.idTask },
            { ...req.body },
            {
                returnDocument: "after",
            }
        )
            .populate("works comments")
            .populate({
                path: "members",
                select: { avatar: 1, username: 1, email: 1 },
            });

        return res
            .status(200)
            .json({ msg: "Cập nhật Dữ liệu thành công.", task: updateTask });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        let findTask = await Task.findOne({ _id: req.params.idTask });
        let findColumnId = findTask.column;
        await Column.findOneAndUpdate(
            {
                _id: findColumnId,
            },
            {
                $pull: {
                    tasks: req.params.idTask,
                },
                $pull: {
                    taskOrder: req.params.idTask,
                },
            }
        );
        await Task.findOneAndDelete({ _id: req.params.idTask });
        await Comment.deleteMany({
            task: req.params.idTask,
        });
        await Work.deleteMany({
            task: req.params.idTask,
        });
        return res.json({
            idTask: req.params.idTask,
            msg: "Xóa nhiệm vụ thành công.",
        });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};


// Thêm hàm này vào cuối file của bạn
export const updateWorkStatus = async (req, res) => {
    try {
        const { workId } = req.params; // Lấy workId từ URL
        const { isCompleted } = req.body; // Lấy trạng thái mới từ request body

        // Kiểm tra xem isCompleted có được gửi lên không
        if (typeof isCompleted !== 'boolean') {
            return res.status(400).json({ err: "Trạng thái 'isCompleted' phải là true hoặc false." });
        }

        // Tìm và cập nhật Work trong database
        // Dùng findOneAndUpdate để tìm và cập nhật trong 1 lệnh
        const updatedWork = await Work.findOneAndUpdate(
            { _id: workId },
            { isCompleted: isCompleted },
            { new: true } // Tùy chọn này để lệnh trả về document đã được cập nhật
        );

        if (!updatedWork) {
            return res.status(404).json({ err: "Không tìm thấy nhiệm vụ con." });
        }

        return res.json({
            msg: "Cập nhật trạng thái thành công.",
            work: updatedWork,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ err: error.message });
    }
};