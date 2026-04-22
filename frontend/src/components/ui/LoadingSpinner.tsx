import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Loading...', 
  className = '', 
  size = 24 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 text-gray-500 ${className}`}>
      <Loader2 size={size} className="animate-spin mb-2" />
      {text && <span className="text-sm font-medium animate-pulse">{text}</span>}
    </div>
  );
};
