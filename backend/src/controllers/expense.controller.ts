import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { expenseService } from '../services/expense.service';
import { CreateExpenseInput } from '../types/expense.type';
import { ApiError } from '../utils/apiError';

export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.headers['x-user-fingerprint'] as string;
  if (!userId) {
    throw new ApiError(401, 'Missing X-User-Fingerprint header');
  }

  const data = req.body as Omit<CreateExpenseInput, 'userId'>;
  
  const { expense, isExisting } = expenseService.createExpense({
    ...data,
    userId
  });

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
  const userId = req.headers['x-user-fingerprint'] as string;
  if (!userId) {
    throw new ApiError(401, 'Missing X-User-Fingerprint header');
  }

  const category = req.query.category as string | undefined;
  const sortParam = req.query.sort as string | undefined;
  const startDate = req.query.startDate as string | undefined;
  const endDate = req.query.endDate as string | undefined;
  
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  
  const sortDesc = sortParam === 'date_desc';

  const { data, meta } = expenseService.getExpenses(userId, category, sortDesc, startDate, endDate, page, limit);

  res.status(200).json({
    message: 'Expenses fetched successfully',
    data,
    meta
  });
});
