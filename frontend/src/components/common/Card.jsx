import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`rounded-2xl border border-purple-100 bg-white/95 backdrop-blur-xs shadow-[0_4px_20px_rgba(48,20,68,0.04)] text-[#160424] ${
        hover ? 'transition-all duration-200 hover:shadow-lg hover:border-purple-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-5 border-b border-purple-100/80 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-lg font-bold text-[#301444] ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-sm text-gray-500 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-4 bg-purple-50/40 border-t border-purple-100/80 rounded-b-2xl flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
