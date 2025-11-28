import React from 'react';


const map: Record<Variant, React.CSSProperties> = {
  primary: { background: '#58A9E0', boxShadow: '0 3px 0 #377fb2' },
  danger:  { background: '#FF4D4F', boxShadow: '0 3px 0 #b92c2e' },
  success: { background: '#3a8d4b', boxShadow: '0 3px 0 #2a6a38' },
  neutral: { background: '#fff',    boxShadow: '0 2px 0 #00000010', border: '2px solid #00000014' },
};

export default function Button({ variant='primary', size='md', block=false, style, children, ...rest }: Props){
  const padding = size === 'sm' ? '8px 14px' : '12px 20px';
  const base: React.CSSProperties = {
    color: variant === 'neutral' ? '#333' : '#fff',
    border: 'none',
    borderRadius: 10,
    fontWeight: 800,
    cursor: 'pointer',
    width: block ? '100%' : undefined,
    padding,
    ...map[variant],
    ...style,
  };
  return <button {...rest} style={base}>{children}</button>;
}
