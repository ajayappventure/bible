const { PrismaClient, TaskStatus } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyAuthToken } = require("../middleware/auth");

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await prisma.task.create({
      data: { title, description },
    });
    res.status(201).json(task);
  } catch (error) {
    console.log("🚀 ~ createTask ~ error:", error);
    res.status(500).json({ error: "Unable to create task" });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch tasks" });
  }
};

// Get a task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🚀 ~ getTaskById ~ id:", id);
    const task = await prisma.task.findUnique({
      where: { id: id.toString() },
    });
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.log("🚀 ~ getTaskById ~ error:", error);
    res.status(500).json({ error: "Unable to fetch task" });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const updatedTask = await prisma.task.update({
      where: { id: id.toString() },
      data: { title, description, status },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Unable to update task" });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: id.toString() },
    });
    res.status(200).json({ msg: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete task" });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
