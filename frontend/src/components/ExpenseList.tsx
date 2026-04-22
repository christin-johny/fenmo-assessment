import React from 'react';
import type { Expense, PaginationMeta } from '../types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  meta: PaginationMeta | null;
  onPageChange: (newPage: number) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, meta, onPageChange }) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">No expenses recorded for this period.</p>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {expense.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  {formatCurrency(expense.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{(meta.page - 1) * meta.limit + 1}</span> to <span className="font-medium">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
