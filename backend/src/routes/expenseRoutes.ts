import { Router } from "express";
import {  getExpenses, pushExpenses } from "../controllers/expenseController";

const router = Router();

router.get("/", getExpenses);
router.post("/", pushExpenses);

export default router;
