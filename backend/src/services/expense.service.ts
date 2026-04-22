import crypto from 'crypto';
import { Expense, CreateExpenseInput, PaginationMeta } from '../types/expense.type';

class ExpenseService {
  private expenses: Expense[] = [];

  public createExpense(data: CreateExpenseInput): { expense: Expense; isExisting: boolean } {
    // Idempotency Check scoped strictly to the current user
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
    
    // 1. Filter by Fingerprint (userId)
    let result = this.expenses.filter(e => e.userId === userId);

    // 2. Filter by Category
    if (category) {
      result = result.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    // 3. Filter by Custom Dates
    if (startDate) {
      result = result.filter(e => new Date(e.date) >= new Date(startDate));
    }
    if (endDate) {
      // In case they pick a day, include that whole day up to 23:59
      result = result.filter(e => new Date(e.date) <= new Date(endDate));
    }

    // 4. Calculate Global Analytics explicitly BEFORE pagination
    const globalTotalAmount = result.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals = result.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    // 5. Sort
    if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.amount - b.amount);
    } else {
      // Default newest
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // 6. Pagination
    const total = result.length;
    const totalPages = Math.ceil(total / limit) || 1;
    
    // Safety check just in case requested page is out of bounds
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
