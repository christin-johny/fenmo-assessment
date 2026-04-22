import crypto from 'crypto';
import { Expense, CreateExpenseInput } from '../types/expense.type';

class ExpenseService {
  private expenses: Expense[] = [];

  public createExpense(data: CreateExpenseInput): { expense: Expense; isExisting: boolean } {
    // Idempotency Check: if it already exists, return it immediately
    const existingExpense = this.expenses.find(
      (expense) => expense.idempotencyKey === data.idempotencyKey
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

  public getExpenses(category?: string, sortDesc?: boolean): Expense[] {
    let result = [...this.expenses];

    if (category) {
      result = result.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    if (sortDesc) {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return result;
  }
}

export const expenseService = new ExpenseService();
