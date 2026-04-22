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
  const [sortBy, setSortBy] = useState('newest');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const getDates = useCallback(() => {
    let startDate: string | undefined = undefined;
    let endDate: string | undefined = undefined;

    if (timeFilter === 'Last 7 Days') {
      const start = new Date();
      start.setDate(start.getDate() - 7);
      startDate = start.toISOString().split('T')[0];
    } else if (timeFilter === 'This Month') {
      const start = new Date();
      start.setDate(1); 
      startDate = start.toISOString().split('T')[0];
    } else if (timeFilter === 'Custom' && customStart && customEnd) {
      startDate = customStart;
      endDate = customEnd;
    }
    
    return { startDate, endDate };
  }, [timeFilter, customStart, customEnd]);

  useEffect(() => {
    const { startDate, endDate } = getDates();
    const ctg = categoryFilter === 'All' || categoryFilter === '' ? undefined : categoryFilter;
    
    loadExpenses(ctg, sortBy, startDate, endDate, currentPage, 10);
  }, [categoryFilter, timeFilter, sortBy, customStart, customEnd, currentPage, loadExpenses, getDates]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleAdd = (val: Omit<CreateExpenseInput, 'idempotencyKey'>) => {
    const { startDate, endDate } = getDates();
    return addExpense(val, { 
      category: categoryFilter === 'All' ? undefined : categoryFilter, 
      startDate, 
      endDate,
      page: 1 
    });
  };

  // Directly use the backend global statistics
  const categoryTotals = meta?.categoryTotals || {};
  const globalTotalAmount = meta?.globalTotalAmount || 0;

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-sans text-slate-800">
      
      {/* Header spanning exactly the top */}
      <header className="shrink-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Expense Tracker</h1>
          <p className="text-xs text-slate-500">Internal Division</p>
        </div>
        
        {/* Total sum card cleanly integrated into header or top right corner */}
        <div className="bg-slate-100 border border-slate-200 px-4 py-1.5 rounded flex flex-col items-end">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">Global Filtered Total</span>
          <span className="text-lg font-bold text-blue-700 leading-none">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(globalTotalAmount)}
          </span>
        </div>
      </header>

      {/* Main Grid Wrapper resolving to 100vh max naturally */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6 max-w-[1400px] w-full mx-auto">
        
        {/* Left Col: Form and Summary fixed */}
        <div className="w-[320px] shrink-0 flex flex-col gap-6 min-h-0 overflow-y-auto pr-1">
          <div className="shrink-0 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <ExpenseForm 
              onAdd={handleAdd} 
              isSubmitting={isSubmitting} 
              error={submitError} 
            />
          </div>

          {/* Category Summary Analytics View */}
          {expenses.length > 0 && (
            <div className="shrink-0 bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 pb-2 border-b border-slate-100">Category Summary</h3>
              <div className="space-y-3">
                {Object.entries(categoryTotals)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, amount]) => {
                    const percentage = globalTotalAmount > 0 ? (amount / globalTotalAmount) * 100 : 0;
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-600">{cat}</span>
                          <span className="font-bold text-slate-800">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Records flexible */}
        <div className="flex-1 flex flex-col min-w-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Top toolbar */}
          <div className="shrink-0 border-b border-slate-200 bg-slate-50/50 p-3 flex flex-wrap gap-3 items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Records</h2>
            
            <div className="flex items-center gap-2">
              <select 
                title="Category"
                value={categoryFilter} 
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="text-xs py-1.5 pl-2 pr-6 border border-slate-300 rounded bg-white text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>

              <select 
                title="Time"
                value={timeFilter} 
                onChange={(e) => { setTimeFilter(e.target.value); setCurrentPage(1); }}
                className="text-xs py-1.5 pl-2 pr-6 border border-slate-300 rounded bg-white text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="All">All Time</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="This Month">This Month</option>
                <option value="Custom">Custom Range</option>
              </select>

              <select 
                title="Sort By"
                value={sortBy} 
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="text-xs py-1.5 pl-2 pr-6 border border-slate-300 rounded bg-white text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>

              {timeFilter === 'Custom' && (
                <div className="flex items-center gap-1.5">
                  <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="text-xs py-1 px-2 border border-slate-300 rounded bg-white outline-none focus:border-blue-500" />
                  <span className="text-slate-400 text-xs">-</span>
                  <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="text-xs py-1 px-2 border border-slate-300 rounded bg-white outline-none focus:border-blue-500" />
                </div>
              )}
            </div>
          </div>

          {error && <ErrorAlert message={error} className="m-3 text-xs" />}
          
          {/* Scrollable list container */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
               <div className="p-4 space-y-3">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="animate-pulse flex items-center space-x-4 bg-slate-50 p-2 rounded">
                     <div className="h-6 w-16 bg-slate-200 rounded"></div>
                     <div className="flex-1 space-y-2">
                       <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                     </div>
                     <div className="h-4 bg-slate-200 rounded w-16"></div>
                   </div>
                 ))}
               </div>
            ) : (
              <ExpenseList expenses={expenses} meta={meta} onPageChange={handlePageChange} />
            )}
          </div>
        </div>

      </main>
    </div>
  );
};
