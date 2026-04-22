import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`flex items-start bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200 shadow-sm ${className}`}>
      <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
      <span className="font-medium">{message}</span>
    </div>
  );
};
