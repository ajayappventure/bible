const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const gmailRoutes = require("./routes/gmailRouts");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());

app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);
app.use("/api", gmailRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Task Management API!");
});
require("./cron/cron");

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
