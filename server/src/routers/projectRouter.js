import { Router } from "express";

// Middleware
import { isAuth, isAdmins, isMembers } from "../middleware/index.js";

// Controllers
import {
    createProject,
    getAllProject,
    getProjectById,
    updateProject,
    deleteProject,
} from "../controllers/projectCtrl.js";
import { createColumn, updateColumn } from "../controllers/columnCtrl.js";
import {
    createTask,
    deleteTask,
    getTaskByID,
    updateTask,
    updateWorkStatus, // <<<--- 1. ĐÃ THÊM IMPORT Ở ĐÂY
} from "../controllers/taskCtrl.js";
import { createWork, deleteWork, updateWork } from "../controllers/workCtrl.js";
import { createComment } from "../controllers/commentCtrl.js";
import { createActivate, getActivates } from "../controllers/activateCtrl.js";

const router = Router();

// === PROJECT ROUTES ===
router.post("/project", isAuth, createProject);
router.get("/projects", isAuth, getAllProject);
router.get("/project/:idProject", isAuth, isMembers, getProjectById);
router.patch("/project/:idProject", isAuth, isMembers, isAdmins, updateProject);
router.delete("/project/:idProject", isAuth, isMembers, isAdmins, deleteProject);

// === COLUMN ROUTES ===
router.post("/project/:idProject/column", isAuth, isMembers, isAdmins, createColumn);
router.patch("/project/:idProject/column/:idColumn", isAuth, isMembers, isAdmins, updateColumn);

// === TASK ROUTES ===
router.post("/project/:idProject/task", isAuth, isMembers, isAdmins, createTask);
router.get("/project/:idProject/task/:idTask", isAuth, isMembers, getTaskByID);
router.patch("/project/:idProject/task/:idTask", isAuth, isMembers, isAdmins, updateTask);
router.delete("/project/:idProject/task/:idTask", isAuth, isMembers, deleteTask);

// === WORK (SUB-TASK) ROUTES ===
router.post("/project/:idProject/task/:idTask/work", isAuth, isMembers, createWork);
router.patch("/project/:idProject/task/:idTask/work/:idWork", isAuth, isMembers, updateWork);
router.delete("/project/:idProject/task/:idTask/work/:idWork", isAuth, isMembers, deleteWork);

// <<<--- 2. ĐÃ THÊM ROUTE MỚI Ở ĐÂY
// Route để cập nhật trạng thái isCompleted của một Work
router.patch("/works/:workId", isAuth, isMembers, updateWorkStatus);

// === COMMENT & ACTIVATE ROUTES ===
router.post("/project/:idProject/task/:idTask/comment", isAuth, isMembers, createComment);
router.post("/activate", isAuth, createActivate);
router.get("/activate", isAuth, getActivates);

export default router;