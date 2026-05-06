import { Request, Response } from "express";
import { Expense } from "../models/Expense";

export const getExpenses = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const expenses = await Expense.find()
      .sort({ date: -1, updatedAt: -1 })
      .exec();
    res.json({ success: true, expenses });
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ success: false, error: "Failed to fetch expenses" });
  }
};

export const pushExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = req.body.expenses;

    for (const expense of expenses) {
      await Expense.findOneAndUpdate(
        { id: expense.id },
        {...expense, synced: true}, // Mark as synced
        { upsert: true }
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
