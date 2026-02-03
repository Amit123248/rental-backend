const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const apiLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

// Connect DB (safe – no process.exit)
connectDB();

const app = express();

/* =======================
   GLOBAL MIDDLEWARES
======================= */
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api", apiLimiter);

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("🚀 Rental Property Backend Running");
});

/* =======================
   ROUTES
======================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/applications", require("./routes/rentalApplicationRoutes"));
app.use("/api/leases", require("./routes/leaseRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/maintenance", require("./routes/maintenanceRoutes"));
app.use("/api/admin/dashboard", require("./routes/adminDashboardRoutes"));

/* =======================
   ERROR HANDLER (LAST)
======================= */
app.use(errorHandler);

/* =======================
   SOCKET.IO SETUP
======================= */
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🔔 User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined notification room`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.set("io", io);

/* =======================
   START SERVER
======================= */
server.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
