import React, { useState, useEffect, useCallback } from 'react';
import { type CreateExpenseInput } from '../types/expense';
import { useExpenses } from '../hooks/useExpenses';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { ErrorAlert } from '../components/ui/ErrorAlert';

export const Dashboard: React.FC = () => {
  const { 
    expenses, 
    meta,
    isLoading, 
    error, 
    isSubmitting, 
    submitError, 
    addExpense,
    loadExpenses
  } = useExpenses();

  const [categoryFilter, setCategoryFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('All');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Derive start/end dates from dropdown
  const getDates = useCallback(() => {
    let startDate: string | undefined = undefined;
    let endDate: string | undefined = undefined;

    if (timeFilter === 'Last 7 Days') {
      const start = new Date();
      start.setDate(start.getDate() - 7);
      startDate = start.toISOString().split('T')[0];
    } else if (timeFilter === 'This Month') {
      const start = new Date();
      start.setDate(1); // First day of current month
      startDate = start.toISOString().split('T')[0];
    } else if (timeFilter === 'Custom' && customStart && customEnd) {
      startDate = customStart;
      endDate = customEnd;
    }
    
    return { startDate, endDate };
  }, [timeFilter, customStart, customEnd]);

  // Re-fetch when filters or page changes
  useEffect(() => {
    const { startDate, endDate } = getDates();
    const ctg = categoryFilter === 'All' || categoryFilter === '' ? undefined : categoryFilter;
    
    loadExpenses(ctg, true, startDate, endDate, currentPage, 10);
  }, [categoryFilter, timeFilter, customStart, customEnd, currentPage, loadExpenses, getDates]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleAdd = (val: Omit<CreateExpenseInput, 'idempotencyKey'>) => {
    // Re-calculate exactly when adding to properly assign to current state
    const { startDate, endDate } = getDates();
    return addExpense(val, { 
      category: categoryFilter === 'All' ? undefined : categoryFilter, 
      startDate, 
      endDate,
      page: 1 // Reset to page 1 to see the new entry
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="mb-8 pl-1">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Expense Tracker</h1>
        <p className="text-gray-500">Track and isolate your secure personal records.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <ExpenseForm 
            onAdd={handleAdd} 
            isSubmitting={isSubmitting} 
            error={submitError} 
          />

          <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100">
            <h3 className="text-sm font-semibold text-indigo-800 mb-1">Total Found</h3>
            <p className="text-3xl font-bold text-gray-900">
              {meta ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(expenses.reduce((s, e) => s + e.amount, 0)) : '₹0.00'}
            </p>
            <p className="text-xs text-indigo-500 mt-2">Displaying combined visible expenses</p>
          </div>
        </div>

        {/* Right Column: List & Filters */}
        <div className="lg:col-span-2">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-800 shrink-0">Records</h2>
            
            <div className="flex flex-wrap items-center gap-3">
              <select 
                value={categoryFilter} 
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent text-gray-700 bg-gray-50"
              >
                <option value="All">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>

              <select 
                value={timeFilter} 
                onChange={(e) => { setTimeFilter(e.target.value); setCurrentPage(1); }}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent text-gray-700 bg-gray-50"
              >
                <option value="All">All Time</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="This Month">This Month</option>
                <option value="Custom">Custom Range</option>
              </select>

              {timeFilter === 'Custom' && (
                <div className="flex items-center space-x-2 animate-in fade-in zoom-in duration-200">
                  <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="text-sm border-gray-300 rounded shadow-sm text-gray-700" />
                  <span className="text-gray-400">-</span>
                  <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="text-sm border-gray-300 rounded shadow-sm text-gray-700" />
                </div>
              )}
            </div>
          </div>

          {error && <ErrorAlert message={error} className="mb-4" />}
          
          {isLoading ? (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="animate-pulse flex space-x-4">
                   <div className="flex-1 space-y-4 py-1">
                     <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                     <div className="space-y-2">
                       <div className="h-4 bg-gray-200 rounded"></div>
                       <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
            <ExpenseList expenses={expenses} meta={meta} onPageChange={handlePageChange} />
          )}
        </div>
      </div>
    </div>
  );
};
