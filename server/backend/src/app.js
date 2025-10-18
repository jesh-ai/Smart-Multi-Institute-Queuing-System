import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

// Root message
app.get("/", (req, res) => {
  res.send("Hello from Smart Queue Backend Team!");
});

// Versioned API routes
app.use("/api", router);

// Health check endpoint
app.get("/health", (req, res) => res.json({ status: "ok" }));

export default app;
