export interface Parcela {
  numeroParcela: number;
  dataVencimento: string;
  valorParcela: number;
}

export interface Titulo {
  numeroTitulo: string;
  nomeDevedor: string;
  cpfDevedor: string;
  percentualJuros: number;
  percentualMulta: number;
  parcelas: Parcela[]; // 🔥 AQUI ESTÁ A CORREÇÃO
}