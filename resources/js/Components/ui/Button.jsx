import React from 'react';

export default function Button({ children, className = '', disabled = false, ...props }) {
    return (
        <button
            {...props}
            className={`inline-flex items-center px-4 py-2 border rounded-md font-semibold text-xs uppercase tracking-widest transition ease-in-out duration-150 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
} 