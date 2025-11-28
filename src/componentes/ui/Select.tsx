import React from 'react';

export default function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{
        height: 36,
        border: '2px solid #00000018',
        borderRadius: 10,
        padding: '0 10px',
        outline: 'none',
        background: '#fff5e4',
        width: '100%',
        ...(props.style || {})
      }}
    />
  );
}
