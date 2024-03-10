import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { getBarCharts, getDashboardStats, getLinecharts, getPieCharts } from "../controllers/admin-dash.js";
const app = express.Router();
//stats route - /api/v1/dashboard/stats
app.get("/stats", adminOnly, getDashboardStats);
//pie chart route - /api/v1/dashboard/pie
app.get("/pie", adminOnly, getPieCharts);
//stats route - /api/v1/dashboard/bar
app.get("/bar", adminOnly, getBarCharts);
//stats route - /api/v1/dashboard/line
app.get("/line", adminOnly, getLinecharts);
export default app;
