global.crypto = require("crypto");
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const connectDB = require("./config/db");
const todoRoute = require("./routes/todo.route");
const employeeRoute = require("./routes/employee.route");
const productRoute = require("./routes/product.route");
const cors = require("cors");
// --- BẮT ĐẦU APP INSIGHTS ---
const appInsights = require("applicationinsights");
const connectionString =
  process.env.APPLICATIONINSIGHTS_CONNECTION_STRING ||
  process.env.APPINSIGHTS_CONNECTION_STRING;
if (connectionString) {
  appInsights
    .setup(connectionString)
    .setAutoCollectConsole(true, true) // Thu thập cả log console.log
    .setSendLiveMetrics(true) // Cho phép xem realtime
    .start();
  console.log("✅ Azure Application Insights started!");
} else {
  console.log("⚠️ No Connection String found, App Insights disabled.");
}
// --- KẾT THÚC APP INSIGHTS ---
const app = express();
const authMiddleware = require("./middleware/authMiddleware");
const authRoute = require("./routes/auth.route");
app.use(cors());
connectDB();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello interview!" });
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Service is healthy" });
});
app.use("/auth", authRoute);
app.use("/todos", todoRoute);
app.get("/test-error", (req, res) => {
  throw new Error("TEST ALERT: Đây là lỗi thử nghiệm để kiểm tra Azure Alert!");
});
app.use("/employees", authMiddleware, employeeRoute);
app.use("/products", authMiddleware, productRoute);
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
