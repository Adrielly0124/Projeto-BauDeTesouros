/** Funções de formatação (datas, moeda, textos) */

export function formatarMoedaBR(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return ''
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
  } catch {
    return `R$ ${valor.toFixed(2)}`
  }
}

export function formatarDataCurta(iso: string): string {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(d)
  } catch {
    return iso
  }
}

export function clamp(num: number, min: number, max: number) {
  return Math.max(min, Math.min(max, num))
}

export function normalizarBusca(txt: string) {
  return txt.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}
