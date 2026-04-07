import express, { Request, Response } from "express";
import cors from "cors";
import { initializeDatabase } from "./data-source";
import * as dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
    try {
        await initializeDatabase();
        next();
    } catch (error) {
        console.error("Database connection failed", error);
        res.status(500).json({ error: "Database connection failed" });
    }
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Use extracted routes
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

export { app };
