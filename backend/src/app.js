const express = require("express");

const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");
const jobRoutes = require("./routes/job-routes");
const applicationRoutes = require("./routes/application-routes");
const adminRoutes = require("./routes/admin-routes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Edu-Work API is running");
});

module.exports = app;