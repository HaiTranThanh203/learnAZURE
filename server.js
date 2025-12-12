require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const connectDB = require("./config/db");
const todoRoute = require("./routes/todo.route");
const app = express();
const authRoute = require("./routes/auth.route");
connectDB();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello interview!" });
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Service is healthy' });
});
app.use("/api/auth", authRoute);
app.use("/api/todos",todoRoute);
app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

app.use((err, req, res) => {
  res.status(err.status || 500).json({
    status: err.status,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
