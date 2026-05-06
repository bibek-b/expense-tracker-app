import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
}

const expenseSchema = new Schema<IExpense>(
  {
    id: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    note: { type: String, default: null },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    synced: { type: Boolean, default: false },
  },
);

expenseSchema.index({ date: 1 });
expenseSchema.index({ updatedAt: 1 });

export const Expense = mongoose.model<IExpense>("Expense", expenseSchema);
