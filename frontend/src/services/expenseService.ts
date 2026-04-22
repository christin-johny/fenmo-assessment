import api from './api';
import type { Expense, CreateExpenseInput, PaginationMeta } from '../types/expense';

interface GetExpensesResponse {
  message: string;
  data: Expense[];
  meta: PaginationMeta;
}

interface CreateExpenseResponse {
  message: string;
  data: Expense;
}

export const fetchExpenses = async (
  category?: string, 
  sortDesc = true,
  startDate?: string,
  endDate?: string,
  page = 1,
  limit = 10
): Promise<{ data: Expense[]; meta: PaginationMeta }> => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (sortDesc) params.append('sort', 'date_desc');
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const { data } = await api.get<GetExpensesResponse>(`/expenses?${params.toString()}`);
  return { data: data.data, meta: data.meta };
};

export const createExpense = async (expenseData: CreateExpenseInput): Promise<Expense> => {
  const { data } = await api.post<CreateExpenseResponse>('/expenses', expenseData);
  return data.data;
};
