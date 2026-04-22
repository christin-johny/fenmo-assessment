import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { expenseService } from '../services/expense.service';
import { CreateExpenseInput } from '../types/expense.type';

export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateExpenseInput;
  
  const { expense, isExisting } = expenseService.createExpense(data);

  if (isExisting) {
    res.status(200).json({
      message: 'Expense already created (idempotency hit)',
      data: expense
    });
    return;
  }

  res.status(201).json({
    message: 'Expense created successfully',
    data: expense
  });
});

export const getExpenses = asyncHandler(async (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const sortParam = req.query.sort as string | undefined;
  
  const sortDesc = sortParam === 'date_desc';

  const expenses = expenseService.getExpenses(category, sortDesc);

  res.status(200).json({
    message: 'Expenses fetched successfully',
    data: expenses
  });
});
