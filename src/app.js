const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const gmailRoutes = require("./routes/gmailRouts");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const swagger = require("../swaggerDocs");

const app = express();
app.use(express.json());
app.use(swagger);

app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);
app.use("/api", gmailRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Task Management API!");
});

require("./cron/cron");

if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for testing
module.exports = app;
