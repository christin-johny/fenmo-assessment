import React, { useState } from 'react';
import { type CreateExpenseInput } from '../types/expense';
import { ErrorAlert } from './ui/ErrorAlert';
import { Loader2 } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;
    
    // We parse Date correctly into ISO and construct payload
    const payload = {
      amount: parseFloat(amount),
      category: category.trim(),
      description: description.trim(),
      date: new Date(date).toISOString(), // ensure backend gets an ISO string
    };

    const success = await onAdd(payload);
    
    if (success) {
      setAmount('');
      setCategory('');
      setDescription('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Expense</h2>
      
      {error && <ErrorAlert message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 text-gray-900"
          >
            <option value="" disabled>Select a category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-60 transition-colors"
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
