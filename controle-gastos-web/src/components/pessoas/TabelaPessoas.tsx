//componentizando para que fique melhor de ler e com responsabilidades melhor divididas
import { useState } from 'react';
import { Pessoa } from '../../types';

interface TabelaPessoasProps {
  pessoas: Pessoa[];
  onDeletarPessoa: (id: number) => void;
}

export const TabelaPessoas: React.FC<TabelaPessoasProps> = ({ pessoas, onDeletarPessoa }) => {
  // Controle de estado para filtro de busca e navegação de página
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  // 1. Filtra a lista de pessoas em tempo real com base no texto digitado (case-insensitive)
  const pessoasFiltradas = pessoas.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // 2. Lógica de Paginação (Client-side): calcula o total de páginas e fatia o array filtrado
  const totalPaginas = Math.ceil(pessoasFiltradas.length / itensPorPagina) || 1;
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const pessoasPaginadas = pessoasFiltradas.slice(indiceInicial, indiceInicial + itensPorPagina);

  return (
    <div>
      {/* Campo de pesquisa por nome */}
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <input
          type="text"
          placeholder="🔍 Pesquisar pessoa por nome..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPaginaAtual(1); // Reseta para a primeira página a cada nova busca
          }}
          style={{
            width: '100%',
            maxWidth: '320px',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.9em',
            outline: 'none',
          }}
        />
        <span style={{ fontSize: '0.85em', color: '#64748b' }}>
          Total encontrado: <strong>{pessoasFiltradas.length}</strong> registro(s)
        </span>
      </div>

      {/* Exibição condicional: mensagem amigável caso não encontre dados */}
      {pessoasPaginadas.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          {busca ? `Nenhuma pessoa encontrada com "${busca}".` : 'Nenhuma pessoa cadastrada.'}
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left', color: '#475569' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>ID</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Nome</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Idade</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Categoria</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0', textAlign: 'center' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {pessoasPaginadas.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px' }}>{p.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.nome}</td>
                <td style={{ padding: '12px' }}>{p.idade} anos</td>
                <td style={{ padding: '12px' }}>
                  {/* Destaque visual para a regra de negócio de menoridade */}
                  {p.idade < 18 ? (
                    <span style={{ color: '#d97706', fontWeight: 'bold' }}>👶 Menor de Idade</span>
                  ) : (
                    <span style={{ color: '#059669', fontWeight: 'bold' }}>👤 Maior de Idade</span>
                  )}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => onDeletarPessoa(p.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#dc2626',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Controles de navegação da paginação (exibidos apenas se houver mais de 1 página) */}
      {pessoasFiltradas.length > itensPorPagina && (
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