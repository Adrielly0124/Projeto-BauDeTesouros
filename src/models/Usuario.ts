export interface Usuario {
  id: string;                     // gerado pelo Firebase Auth (UID)
  tipo: "responsavel" | "admin" | "";   // tipo de usuário selecionado no cadastro
  nome: string;                   // nome completo
  email: string;                  // usado para login
  cpf: string;                // CPF ou CNPJ em um único campo
  criadoEm: string;               // timestamp para auditoria
}