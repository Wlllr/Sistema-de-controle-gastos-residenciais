export enum TipoTransacao {
    Despesa = 1,
    Receita = 2,
  }
  
  export interface Pessoa {
    id: number;
    nome: string;
    idade: number;
  }
  
  export interface CriarPessoaDto {
    nome: string;
    idade: number;
  }
  
  export interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    pessoaId: number;
    pessoa?: Pessoa;
  }
  
  export interface CriarTransacaoDto {
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    pessoaId: number;
  }
  
  export interface ResumoPessoa {
    id: number;
    nome: string;
    idade: number;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
  }
  
  export interface RelatorioTotais {
    pessoas: ResumoPessoa[];
    totalGeralReceitas: number;
    totalGeralDespesas: number;
    saldoLiquidoGeral: number;
  }