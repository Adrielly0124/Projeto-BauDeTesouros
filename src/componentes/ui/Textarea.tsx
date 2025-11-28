import React from 'react';

export default function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{
        border: '2px solid #00000018',
        borderRadius: 10,
        padding: '10px 12px',
        outline: 'none',
        background: '#fff5e4',
        width: '100%',
        ...(props.style || {})
      }}
    />
  );
}
