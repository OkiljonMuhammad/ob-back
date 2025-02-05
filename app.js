import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js";
import commentRoutes from "./routes/commentRoutes.js"
import likeRoutes from "./routes/likeRoutes.js"

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(rateLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/template", templateRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/like", likeRoutes);

export default app;