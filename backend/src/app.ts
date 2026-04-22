import express, { Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

import expenseRoutes from './routes/expense.routes';

// Routes Placeholder
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/expenses', expenseRoutes);

app.use(errorHandler);

export default app;
