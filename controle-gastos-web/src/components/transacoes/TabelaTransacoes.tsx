//componentizando para que fique melhor de ler e com responsabilidades melhor divididas
import { useState } from 'react';
import { Transacao, TipoTransacao } from '../../types';

interface TabelaTransacoesProps {
  transacoes: Transacao[];
  formatarMoeda: (valor: number) => string;
}

export const TabelaTransacoes: React.FC<TabelaTransacoesProps> = ({ transacoes, formatarMoeda }) => {
  // Estados para gerenciar a busca por texto, filtro de tipo e a página atual
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | TipoTransacao>('todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  // 1. Aplica filtro duplo combinando busca por descrição e tipo de transação (Receita/Despesa/Todas)
  const transacoesFiltradas = transacoes.filter((t) => {
    const bateuDescricao = t.descricao.toLowerCase().includes(busca.toLowerCase());
    const bateuTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;
    return bateuDescricao && bateuTipo;
  });

  // 2. Lógica de Paginação (Client-side)
  const totalPaginas = Math.ceil(transacoesFiltradas.length / itensPorPagina) || 1;
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const transacoesPaginadas = transacoesFiltradas.slice(indiceInicial, indiceInicial + itensPorPagina);

  return (
    <div>
      {/* Controles de Filtros: Campo de busca por texto e dropdown de seleção de categoria */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Pesquisar por descrição..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPaginaAtual(1); // Retorna à primeira página para evitar páginas vazias
          }}
          style={{
            flex: '1',
            minWidth: '200px',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.9em',
            outline: 'none',
          }}
        />

        <select
          value={filtroTipo}
          onChange={(e) => {
            const val = e.target.value;
            setFiltroTipo(val === 'todos' ? 'todos' : Number(val) as TipoTransacao);
            setPaginaAtual(1);
          }}
          style={{
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.9em',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
          }}
        >
          <option value="todos">Todas as Categoria</option>
          <option value={TipoTransacao.Receita}>💰 Apenas Receitas</option>
          <option value={TipoTransacao.Despesa}>💸 Apenas Despesas</option>
        </select>
      </div>

      {/* Renderização da tabela ou mensagem de estado vazio */}
      {transacoesPaginadas.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          Nenhuma transação encontrada para os filtros aplicados.
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left', color: '#475569' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>ID</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Descrição</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Pessoa</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Tipo</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transacoesPaginadas.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px' }}>{t.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{t.descricao}</td>
                {/* Exibe o nome da pessoa vinculada ou o ID como fallback */}
                <td style={{ padding: '12px' }}>{t.pessoa?.nome ?? `ID: ${t.pessoaId}`}</td>
                <td style={{ padding: '12px' }}>
                  {t.tipo === TipoTransacao.Receita ? (
                    <span style={{ color: '#059669', fontWeight: 'bold' }}>💰 Receita</span>
                  ) : (
                    <span style={{ color: '#dc2626', fontWeight: 'bold' }}>💸 Despesa</span>
                  )}
                </td>
                {/* Formatação condicional de sinal (+/-) e cores de acordo com o tipo */}
                <td style={{
                  padding: '12px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  color: t.tipo === TipoTransacao.Receita ? '#059669' : '#dc2626'
                }}>
                  {t.tipo === TipoTransacao.Receita ? '+' : '-'} {formatarMoeda(t.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Controles de Paginação */}
      {transacoesFiltradas.length > itensPorPagina && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
          <span style={{ fontSize: '0.85em', color: '#64748b' }}>
            Página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong>
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              disabled={paginaAtual === 1}
              onClick={() => setPaginaAtual((prev) => prev - 1)}
              style={{
                padding: '6px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer',
                backgroundColor: paginaAtual === 1 ? '#f1f5f9' : '#ffffff',
                color: paginaAtual === 1 ? '#94a3b8' : '#334155',
                fontWeight: 'bold',
              }}
            >
              Anterior
            </button>
            <button
              disabled={paginaAtual === totalPaginas}
              onClick={() => setPaginaAtual((prev) => prev + 1)}
              style={{
                padding: '6px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer',
                backgroundColor: paginaAtual === totalPaginas ? '#f1f5f9' : '#ffffff',
                color: paginaAtual === totalPaginas ? '#94a3b8' : '#334155',
                fontWeight: 'bold',
              }}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};