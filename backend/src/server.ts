import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database";
import expenseRoutes from "./routes/expenseRoutes";

const PORT = Number(process.env.PORT || 3001);

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDatabase();

// Routes
app.use('/api/expenses', expenseRoutes);

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
  console.log(`Connected to MongoDB`);
});
