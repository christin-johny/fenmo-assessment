import api from './api';
import type { Expense, CreateExpenseInput } from '../types/expense';

interface GetExpensesResponse {
  message: string;
  data: Expense[];
}

interface CreateExpenseResponse {
  message: string;
  data: Expense;
}

export const fetchExpenses = async (category?: string, sortDesc = true): Promise<Expense[]> => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (sortDesc) params.append('sort', 'date_desc');

  const { data } = await api.get<GetExpensesResponse>(`/expenses?${params.toString()}`);
  return data.data;
};

export const createExpense = async (expenseData: CreateExpenseInput): Promise<Expense> => {
  const { data } = await api.post<CreateExpenseResponse>('/expenses', expenseData);
  return data.data;
};
