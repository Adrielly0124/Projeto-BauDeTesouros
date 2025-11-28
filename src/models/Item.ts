export interface Item {
  id?: string;
  titulo: string;
  descricao?: string;
  imagem?: string;
  criadoPor: string;
  criadoEm: Date;
}

export function criarItem(data: any, id?: string): Item {
  return {
    id,
    titulo: data.titulo,
    descricao: data.descricao ?? "",
    imagem: data.imagem ?? "",
    criadoPor: data.criadoPor,
    criadoEm: data.criadoEm ? new Date(data.criadoEm) : new Date(),
  };
}
