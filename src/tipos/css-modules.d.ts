// Tipos para importar arquivos .module.css/.module.scss etc.
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

// Permitir import "simples" de .css (sem modules) sem erro de TS
declare module '*.css'
