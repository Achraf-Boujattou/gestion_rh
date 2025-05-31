import React from 'react';

export default function Card({ children, className = '' }) {
    return (
        <div className={`bg-white overflow-hidden shadow-sm rounded-lg ${className}`}>
            {children}
        </div>
    );
} 