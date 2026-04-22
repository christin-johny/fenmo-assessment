import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, CreateExpenseInput } from '../types/expense';
import * as expenseService from '../services/expenseService';
import { getErrorMessage } from '../utils/errorHandler';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Idempotency Key matching current form instance
  const [idempotencyKey, setIdempotencyKey] = useState<string>(uuidv4());

  const loadExpenses = useCallback(async (category?: string, sortDesc = true) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await expenseService.fetchExpenses(category, sortDesc);
      setExpenses(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addExpense = async (expenseData: Omit<CreateExpenseInput, 'idempotencyKey'>) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await expenseService.createExpense({
        ...expenseData,
        idempotencyKey
      });
      
      // Successfully created, add to list natively (assuming sorting is generic enough or user will refetch)
      // Best to just reload to enforce correct sorting
      await loadExpenses();
      
      // Re-roll the idempotency key for the next clean submission!
      setIdempotencyKey(uuidv4());
      return true;
    } catch (err) {
      setSubmitError(getErrorMessage(err));
      // Look: We DO NOT reset the idempotency key here. If the user clicks submit again,
      // it retries the exact same key.
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    loadExpenses();
  }, [loadExpenses]);

  return {
    expenses,
    isLoading,
    error,
    isSubmitting,
    submitError,
    addExpense,
    loadExpenses
  };
};
