import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { createExpenseSchema } from '../schemas/expense.schema';
import { createExpense, getExpenses } from '../controllers/expense.controller';

const router = Router();

router.post('/', validateRequest(createExpenseSchema), createExpense);
router.get('/', getExpenses);

export default router;
