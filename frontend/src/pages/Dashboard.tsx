import React, { useState, useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorAlert } from '../components/ui/ErrorAlert';

export const Dashboard: React.FC = () => {
  const { 
    expenses, 
    isLoading, 
    error, 
    isSubmitting, 
    submitError, 
    addExpense,
    loadExpenses
  } = useExpenses();

  const [categoryFilter, setCategoryFilter] = useState('');

  // We handle filtering locally, or we could pass it to loadExpenses to do it on the backend.
  // Since the assignment asked to support backend query params layer, we will trigger backend re-fetch.
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategoryFilter(val);
    loadExpenses(val === 'All' ? undefined : val, true);
  };

  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
        <p className="text-gray-500">Track your personal expenses reliably.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <ExpenseForm 
            onAdd={addExpense} 
            isSubmitting={isSubmitting} 
            error={submitError} 
          />

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Visible Expenses</h3>
            <p className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)}
            </p>
          </div>
        </div>

        {/* Right Column: List & Filters */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Recent Expenses</h2>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-500">Filter:</label>
              <select 
                value={categoryFilter} 
                onChange={handleFilterChange}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent text-gray-900"
              >
                <option value="All">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {error && <ErrorAlert message={error} className="mb-4" />}
          
          {isLoading ? (
            <LoadingSpinner text="Loading expenses..." size={32} className="py-12" />
          ) : (
            <ExpenseList expenses={expenses} />
          )}
        </div>
      </div>
    </div>
  );
};
