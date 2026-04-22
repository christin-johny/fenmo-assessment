import React from 'react';
import type { Expense, PaginationMeta } from '../types/expense';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  meta: PaginationMeta | null;
  onPageChange: (newPage: number) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, meta, onPageChange }) => {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <svg className="w-10 h-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-sm font-semibold">No records found</h3>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm shadow-slate-200/50">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 whitespace-nowrap text-xs text-slate-600">
                  {formatDate(expense.date)}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="px-2 py-0.5 inline-flex text-[10px] font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs text-slate-600 max-w-[200px] truncate">
                  {expense.description || <span className="text-slate-300">-</span>}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-xs font-semibold text-slate-800 text-right">
                  {formatCurrency(expense.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-auto sticky bottom-0 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between z-10">
          <div className="text-[11px] text-slate-500">
            Records <span className="font-semibold text-slate-700">{(meta.page - 1) * meta.limit + 1}</span> - <span className="font-semibold text-slate-700">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-semibold text-slate-700">{meta.total}</span>
          </div>
          <div className="flex space-x-1.5">
            <button
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="px-2 py-1 border border-slate-200 rounded flex items-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="px-2 py-1 border border-slate-200 rounded flex items-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
