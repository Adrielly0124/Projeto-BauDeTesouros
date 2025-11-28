// Tipagem para import de imagens e SVGs
declare module '*.svg' {
  const caminho: string
  export default caminho
}

declare module '*.png' {
  const caminho: string
  export default caminho
}

declare module '*.jpg' {
  const caminho: string
  export default caminho
}

declare module '*.jpeg' {
  const caminho: string
  export default caminho
}
