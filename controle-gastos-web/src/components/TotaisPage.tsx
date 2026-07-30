import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RelatorioTotais } from '../types';

export const TotaisPage: React.FC = () => {
  const [relatorio, setRelatorio] = useState<RelatorioTotais | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarTotais();
  }, []);

  const carregarTotais = async () => {
    try {
      setLoading(true);
      const response = await api.get<RelatorioTotais>('/totais');
      setRelatorio(response.data);
    } catch (err) {
      setErro('Erro ao carregar o relatório de totais.');
    } finally {
      setLoading(false);
    }
  };

  // Função utilitária para formatar valores em Reais (R$)
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Carregando dados financeiros...</p>;
  }

  if (erro) {
    return (
      <div style={{ padding: '15px', backgroundColor: '#ffe6e6', color: '#cc0000', borderRadius: '4px' }}>
        {erro}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>📊 Consulta de Totais e Resumo Financeiro</h2>

      {relatorio && (
        <>
          {/* CARDS DE RESUMO GERAL DO SISTEMA */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
            
            {/* Card Total Receitas */}
            <div style={{ flex: '1', minWidth: '200px', padding: '15px', backgroundColor: '#e6ffe6', borderLeft: '5px solid #28a745', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.9em', color: '#555', fontWeight: 'bold' }}>TOTAL RECEITAS</span>
              <h3 style={{ margin: '10px 0 0 0', color: '#28a745', fontSize: '1.5em' }}>
                {formatarMoeda(relatorio.totalGeralReceitas)}
              </h3>
            </div>

            {/* Card Total Despesas */}
            <div style={{ flex: '1', minWidth: '200px', padding: '15px', backgroundColor: '#ffe6e6', borderLeft: '5px solid #dc3545', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.9em', color: '#555', fontWeight: 'bold' }}>TOTAL DESPESAS</span>
              <h3 style={{ margin: '10px 0 0 0', color: '#dc3545', fontSize: '1.5em' }}>
                {formatarMoeda(relatorio.totalGeralDespesas)}
              </h3>
            </div>

            {/* Card Saldo Líquido Geral */}
            <div style={{
              flex: '1',
              minWidth: '200px',
              padding: '15px',
              backgroundColor: relatorio.saldoLiquidoGeral >= 0 ? '#e6f2ff' : '#fff0f0',
              borderLeft: `5px solid ${relatorio.saldoLiquidoGeral >= 0 ? '#0066cc' : '#d9534f'}`,
              borderRadius: '4px'
            }}>
              <span style={{ fontSize: '0.9em', color: '#555', fontWeight: 'bold' }}>SALDO LÍQUIDO GERAL</span>
              <h3 style={{
                margin: '10px 0 0 0',
                color: relatorio.saldoLiquidoGeral >= 0 ? '#0066cc' : '#d9534f',
                fontSize: '1.5em'
              }}>
                {formatarMoeda(relatorio.saldoLiquidoGeral)}
              </h3>
            </div>
          </div>

          <hr style={{ marginBottom: '25px' }} />

          {/* TABELA DE TOTAIS INDIVIDUAIS POR PESSOA */}
          <h3>Resumo por Pessoa</h3>
          
          {relatorio.pessoas.length === 0 ? (
            <p>Nenhuma pessoa cadastrada no sistema.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>ID</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Nome</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Idade</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Receitas</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Despesas</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {relatorio.pessoas.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px' }}>{p.id}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.nome}</td>
                    <td style={{ padding: '12px' }}>{p.idade} anos</td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#28a745', fontWeight: 'bold' }}>
                      {formatarMoeda(p.totalReceitas)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#dc3545', fontWeight: 'bold' }}>
                      {formatarMoeda(p.totalDespesas)}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: p.saldo >= 0 ? '#0066cc' : '#dc3545'
                    }}>
                      {formatarMoeda(p.saldo)}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Rodapé da tabela reforçando o somatório global */}
              <tfoot>
                <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                  <td colSpan={3} style={{ padding: '12px', textAlign: 'right' }}>TOTAL ACUMULADO:</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#28a745' }}>
                    {formatarMoeda(relatorio.totalGeralReceitas)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#dc3545' }}>
                    {formatarMoeda(relatorio.totalGeralDespesas)}
                  </td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'right',
                    color: relatorio.saldoLiquidoGeral >= 0 ? '#0066cc' : '#dc3545'
                  }}>
                    {formatarMoeda(relatorio.saldoLiquidoGeral)}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </>
      )}
    </div>
  );
};