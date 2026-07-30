import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RelatorioTotais } from '../types';
import { CardsResumo } from './totais/CardsResumo';
import { GraficosTotais } from './totais/GraficosTotais';
import { TabelaTotais } from './totais/TabelaTotais';

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
    } catch {
      setErro('Erro ao carregar o relatório de totais.');
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>Carregando dados financeiros...</p>;
  if (erro) return <div style={{ padding: '15px', backgroundColor: '#ffe6e6', color: '#cc0000', borderRadius: '4px' }}>{erro}</div>;

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '10px 20px' }}>
      <h2>📊 Consulta de Totais e Resumo Financeiro</h2>

      {relatorio && (
        <>
          <CardsResumo
            totalReceitas={relatorio.totalGeralReceitas}
            totalDespesas={relatorio.totalGeralDespesas}
            saldoLiquido={relatorio.saldoLiquidoGeral}
            formatarMoeda={formatarMoeda}
          />

          <GraficosTotais
            totalReceitas={relatorio.totalGeralReceitas}
            totalDespesas={relatorio.totalGeralDespesas}
            pessoas={relatorio.pessoas}
            formatarMoeda={formatarMoeda}
          />

          <hr style={{ margin: '30px 0' }} />

          <h3>Resumo Detalhado por Pessoa</h3>
          <TabelaTotais relatorio={relatorio} formatarMoeda={formatarMoeda} />
        </>
      )}
    </div>
  );
};