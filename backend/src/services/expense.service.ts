import crypto from 'crypto';
import { Expense, CreateExpenseInput, PaginationMeta } from '../types/expense.type';

class ExpenseService {
  private expenses: Expense[] = [];

  public createExpense(data: CreateExpenseInput): { expense: Expense; isExisting: boolean } {
    const existingExpense = this.expenses.find(
      (expense) => expense.idempotencyKey === data.idempotencyKey && expense.userId === data.userId
    );

    if (existingExpense) {
      return { expense: existingExpense, isExisting: true };
    }

    const newExpense: Expense = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.expenses.push(newExpense);
    return { expense: newExpense, isExisting: false };
  }

  public getExpenses(
    userId: string,
    category?: string, 
    sortBy?: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10
  ): { data: Expense[]; meta: PaginationMeta } {
    let result = this.expenses.filter(e => e.userId === userId);

    if (category) {
      result = result.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    if (startDate) {
      result = result.filter(e => new Date(e.date) >= new Date(startDate));
    }
    if (endDate) {
      result = result.filter(e => new Date(e.date) <= new Date(endDate));
    }

    const globalTotalAmount = result.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals = result.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.amount - b.amount);
    } else {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const total = result.length;
    const totalPages = Math.ceil(total / limit) || 1;
    
    const safePage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (safePage - 1) * limit;
    const paginatedData = result.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      meta: {
        total,
        page: safePage,
        limit,
        totalPages,
        globalTotalAmount,
        categoryTotals
      }
    };
  }
}

export const expenseService = new ExpenseService();
