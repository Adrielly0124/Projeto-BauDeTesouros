/** Validações simples para formulários */

export function obrigatorio(valor: string) {
  return valor?.trim().length > 0
}

export function emailBasico(valor: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
}

export function numeroNaoNegativo(n: number) {
  return typeof n === 'number' && isFinite(n) && n >= 0
}
