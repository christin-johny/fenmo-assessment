import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Expense, CreateExpenseInput, PaginationMeta } from '../types/expense';
import * as expenseService from '../services/expenseService';
import { getErrorMessage } from '../utils/errorHandler';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [idempotencyKey, setIdempotencyKey] = useState<string>(uuidv4());

  const loadExpenses = useCallback(async (
    category?: string, 
    sortBy: string = 'newest',
    startDate?: string,
    endDate?: string,
    page = 1,
    limit = 10
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, meta } = await expenseService.fetchExpenses(category, sortBy, startDate, endDate, page, limit);
      setExpenses(data);
      setMeta(meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addExpense = async (
    expenseData: Omit<CreateExpenseInput, 'idempotencyKey'>,
    currentFilters: { category?: string, startDate?: string, endDate?: string, page?: number }
  ) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await expenseService.createExpense({
        ...expenseData,
        idempotencyKey
      });
      
      await loadExpenses(currentFilters.category, 'newest', currentFilters.startDate, currentFilters.endDate, 1, 10);
      
      setIdempotencyKey(uuidv4());
      return true;
    } catch (err) {
      setSubmitError(getErrorMessage(err));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    expenses,
    meta,
    isLoading,
    error,
    isSubmitting,
    submitError,
    addExpense,
    loadExpenses
  };
};
