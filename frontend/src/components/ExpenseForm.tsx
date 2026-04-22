import React, { useState } from 'react';
import { type CreateExpenseInput } from '../types/expense';
import { ErrorAlert } from './ui/ErrorAlert';
import { Loader2, AlertCircle } from 'lucide-react';

interface ExpenseFormProps {
  onAdd: (data: Omit<CreateExpenseInput, 'idempotencyKey'>) => Promise<boolean>;
  isSubmitting: boolean;
  error: string | null;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd, isSubmitting, error }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Frontend specific validation errors
  const [fieldErrors, setFieldErrors] = useState<{ amount?: string; category?: string; date?: string }>({});

  const validate = (): boolean => {
    const errors: { amount?: string; category?: string; date?: string } = {};
    let isValid = true;

    if (!amount || parseFloat(amount) <= 0) {
      errors.amount = "Amount must be greater than 0.";
      isValid = false;
    }

    if (!category.trim()) {
      errors.category = "Please select a valid category.";
      isValid = false;
    }

    if (!date) {
      errors.date = "Date is securely required.";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const payload = {
      amount: parseFloat(amount),
      category: category.trim(),
      description: description.trim(),
      date: new Date(date).toISOString(),
    };

    const success = await onAdd(payload);
    
    if (success) {
      setAmount('');
      setCategory('');
      setDescription('');
      setFieldErrors({}); // Clear validation errors on success
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Expense</h2>
      
      {/* Global backend/network errors */}
      {error && <ErrorAlert message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($) *</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (fieldErrors.amount) setFieldErrors({ ...fieldErrors, amount: undefined });
            }}
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 disabled:opacity-50 transition-colors ${
              fieldErrors.amount ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-300 focus:ring-accent focus:border-accent'
            }`}
            placeholder="0.00"
          />
          {fieldErrors.amount && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.amount}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (fieldErrors.category) setFieldErrors({ ...fieldErrors, category: undefined });
            }}
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 disabled:opacity-50 text-gray-900 transition-colors ${
              fieldErrors.category ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-300 focus:ring-accent focus:border-accent'
            }`}
          >
            <option value="" disabled>Select a category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          {fieldErrors.category && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.category}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 text-gray-900"
            placeholder="What was this for?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (fieldErrors.date) setFieldErrors({ ...fieldErrors, date: undefined });
            }}
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 disabled:opacity-50 text-gray-900 transition-colors ${
              fieldErrors.date ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-300 focus:ring-accent focus:border-accent'
            }`}
          />
          {fieldErrors.date && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.date}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-60 transition-colors"
        >
          {isSubmitting ? (
             <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</>
          ) : (
            'Add Expense'
          )}
        </button>
      </form>
    </div>
  );
};
