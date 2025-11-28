export function uid(prefix:string='id'){ const r=Math.random().toString(36).slice(2,8); const t=Date.now().toString(36).slice(-4); return `${prefix}_${r}${t}` }
