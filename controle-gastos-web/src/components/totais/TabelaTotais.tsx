//component reutilizavel seguindo boas praticas para melhorar legibilidade
import { RelatorioTotais } from '../../types';

interface TabelaTotaisProps {
  relatorio: RelatorioTotais;
  formatarMoeda: (valor: number) => string;
}

export const TabelaTotais: React.FC<TabelaTotaisProps> = ({ relatorio, formatarMoeda }) => {
  if (relatorio.pessoas.length === 0) {
    return <p style={{ marginTop: '10px' }}>Nenhuma pessoa cadastrada no sistema.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' }}>
      <thead>
        <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left', color: '#475569' }}>
          <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>ID</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Nome</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Idade</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Receitas</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Despesas</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Saldo</th>
        </tr>
      </thead>
      <tbody>
        {relatorio.pessoas.map((p) => (
          <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
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
      <tfoot>
        <tr style={{ backgroundColor: '#f8fafc', fontWeight: 'bold' }}>
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
  );
};