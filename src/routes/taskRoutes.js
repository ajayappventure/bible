const express = require("express");
const { verifyAuthToken } = require("../middleware/auth");
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/:id", verifyAuthToken, getTaskById);
router.post("/", verifyAuthToken, createTask);
router.get("/", verifyAuthToken, getAllTasks);
router.put("/:id", verifyAuthToken, updateTask);
router.delete("/:id", verifyAuthToken, deleteTask);

module.exports = router;
