import React, { useState } from 'react';
import { type CreateExpenseInput } from '../types/expense';
import { ErrorAlert } from './ui/ErrorAlert';
import { Loader2, AlertCircle } from 'lucide-react';

interface ExpenseFormProps {
  onAdd: (data: Omit<CreateExpenseInput, 'idempotencyKey'>) => Promise<boolean>;
  isSubmitting: boolean;
  error: string | null;
}

interface FormValues {
  amount: string;
  category: string;
  description: string;
  date: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd, isSubmitting, error }) => {
  const [values, setValues] = useState<FormValues>({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});

  // Unified validation for single field or all fields
  const validate = (fieldValues = values): Partial<FormValues> => {
    const tempErrors: Partial<FormValues> = {};
    
    if ('amount' in fieldValues) {
      if (!fieldValues.amount || parseFloat(fieldValues.amount) <= 0) {
        tempErrors.amount = "Amount must be > 0";
      }
    }
    if ('category' in fieldValues) {
      if (!fieldValues.category.trim()) {
        tempErrors.category = "Category required";
      }
    }
    if ('date' in fieldValues) {
      if (!fieldValues.date) {
        tempErrors.date = "Date required";
      } else if (new Date(fieldValues.date) > new Date()) {
        tempErrors.date = "No future dates";
      }
    }

    setErrors({ ...errors, ...tempErrors });
    return tempErrors;
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    // Validate only this field on blur
    validate({ [field]: values[field] } as Partial<FormValues>);
  };

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // If the field has an error and user changes it, clear the error immediately
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all touched
    const allTouched = { amount: true, category: true, description: true, date: true };
    setTouched(allTouched);
    
    // Validate all
    const currentErrors = validate(values);
    if (Object.keys(currentErrors).length > 0) return;
    
    const payload = {
      amount: parseFloat(values.amount),
      category: values.category.trim(),
      description: values.description.trim(),
      date: new Date(values.date).toISOString(),
    };

    const success = await onAdd(payload);
    
    if (success) {
      setValues({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setTouched({});
      setErrors({});
    }
  };

  const hasAnyError = Object.keys(errors).some(k => !!errors[k as keyof FormValues]);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm h-full flex flex-col">
      <h2 className="text-lg font-semibold text-slate-800 mb-3">Add Record</h2>
      
      {error && <ErrorAlert message={error} className="mb-3 p-2 text-xs" />}

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Amount *</label>
          <input
            type="number"
            step="0.01"
            value={values.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            onBlur={() => handleBlur('amount')}
            disabled={isSubmitting}
            className={`w-full px-2.5 py-1.5 text-sm border rounded bg-slate-50 outline-none transition-colors ${
              touched.amount && errors.amount 
                ? 'border-red-400 focus:border-red-500 bg-red-50/30' 
                : 'border-slate-300 focus:border-blue-500 focus:bg-white'
            }`}
            placeholder="0.00"
          />
          {touched.amount && errors.amount && (
            <p className="text-[11px] text-red-500 mt-0.5 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> {errors.amount}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Category *</label>
          <select
            value={values.category}
            onChange={(e) => handleChange('category', e.target.value)}
            onBlur={() => handleBlur('category')}
            disabled={isSubmitting}
            className={`w-full px-2.5 py-1.5 text-sm border rounded bg-slate-50 outline-none transition-colors ${
              touched.category && errors.category 
                ? 'border-red-400 focus:border-red-500 bg-red-50/30' 
                : 'border-slate-300 focus:border-blue-500 focus:bg-white'
            }`}
          >
            <option value="" disabled>Select category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          {touched.category && errors.category && (
            <p className="text-[11px] text-red-500 mt-0.5 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> {errors.category}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
          <input
            type="text"
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            disabled={isSubmitting}
            className="w-full px-2.5 py-1.5 text-sm border border-slate-300 bg-slate-50 rounded focus:border-blue-500 focus:bg-white outline-none transition-colors"
            placeholder="Optional notes"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Date *</label>
          <input
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={values.date}
            onChange={(e) => handleChange('date', e.target.value)}
            onBlur={() => handleBlur('date')}
            disabled={isSubmitting}
            className={`w-full px-2.5 py-1.5 text-sm border rounded bg-slate-50 outline-none transition-colors ${
              touched.date && errors.date 
                ? 'border-red-400 focus:border-red-500 bg-red-50/30' 
                : 'border-slate-300 focus:border-blue-500 focus:bg-white'
            }`}
          />
          {touched.date && errors.date && (
            <p className="text-[11px] text-red-500 mt-0.5 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> {errors.date}
            </p>
          )}
        </div>

        <div className="flex-1" /> {/* Spacer */}

        <button
          type="submit"
          disabled={isSubmitting || hasAnyError}
          className="w-full mt-auto py-2 text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
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
