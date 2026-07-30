//component reutilizavel seguindo boas praticas para melhorar legibilidade
interface CardsResumoProps {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
  formatarMoeda: (valor: number) => string;
}

export const CardsResumo: React.FC<CardsResumoProps> = ({
  totalReceitas,
  totalDespesas,
  saldoLiquido,
  formatarMoeda,
}) => {
  return (
    <div style={{ display: 'flex', gap: '15px', margin: '20px 0', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '220px', padding: '15px', backgroundColor: '#e6ffe6', borderLeft: '5px solid #28a745', borderRadius: '6px' }}>
        <span style={{ fontSize: '0.85em', color: '#555', fontWeight: 'bold' }}>TOTAL RECEITAS</span>
        <h3 style={{ margin: '8px 0 0 0', color: '#28a745', fontSize: '1.5em' }}>
          {formatarMoeda(totalReceitas)}
        </h3>
      </div>

      <div style={{ flex: '1', minWidth: '220px', padding: '15px', backgroundColor: '#ffe6e6', borderLeft: '5px solid #dc3545', borderRadius: '6px' }}>
        <span style={{ fontSize: '0.85em', color: '#555', fontWeight: 'bold' }}>TOTAL DESPESAS</span>
        <h3 style={{ margin: '8px 0 0 0', color: '#dc3545', fontSize: '1.5em' }}>
          {formatarMoeda(totalDespesas)}
        </h3>
      </div>

      <div style={{
        flex: '1',
        minWidth: '220px',
        padding: '15px',
        backgroundColor: saldoLiquido >= 0 ? '#e6f2ff' : '#fff0f0',
        borderLeft: `5px solid ${saldoLiquido >= 0 ? '#0066cc' : '#d9534f'}`,
        borderRadius: '6px'
      }}>
        <span style={{ fontSize: '0.85em', color: '#555', fontWeight: 'bold' }}>SALDO LÍQUIDO GERAL</span>
        <h3 style={{
          margin: '8px 0 0 0',
          color: saldoLiquido >= 0 ? '#0066cc' : '#d9534f',
          fontSize: '1.5em'
        }}>
          {formatarMoeda(saldoLiquido)}
        </h3>
      </div>
    </div>
  );
};