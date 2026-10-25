
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";

import taskRoutes from "./routes/task.routes.js";
import authRoute from "./routes/auth.routes.js";
import documentRoutes from "./routes/document.routes.js";

import { authenticate } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Security headers
app.use(helmet());

// Allow requests from your configured frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Compress suitable HTTP responses
app.use(compression());

// Limit incoming request bodies
app.use(express.json({ limit: "100kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "100kb",
    parameterLimit: 100,
  })
);

// Parse cookies when present
app.use(cookieParser());

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "App API is running",
  });
});

// Public authentication routes.
// Login and registration rate limiters should be applied in auth.routes.js.
app.use("/api/v1/auth", authRoute);

// Document routes have their own authentication and task-access middleware.
// Mount them before the broader Task router.
app.use("/api/v1", documentRoutes);

// Task APIs require authentication.
app.use("/api/v1/tasks", authenticate, taskRoutes);

// Central error handler must come last.
app.use(errorHandler);

export default app;
