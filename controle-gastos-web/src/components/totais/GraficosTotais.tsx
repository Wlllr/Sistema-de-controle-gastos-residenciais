//component reutilizavel seguindo boas praticas para melhorar legibilidade
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PessoaTotais } from '../../types';

interface GraficosTotaisProps {
  totalReceitas: number;
  totalDespesas: number;
  pessoas: PessoaTotais[];
  formatarMoeda: (valor: number) => string;
}

const CORES_PESSOAS = ['#2563eb', '#9333ea', '#ea580c', '#0891b2', '#d97706', '#dc2626'];

export const GraficosTotais: React.FC<GraficosTotaisProps> = ({
  totalReceitas,
  totalDespesas,
  pessoas,
  formatarMoeda,
}) => {
  const dadosGeral = [
    { name: 'Receitas Totais', value: totalReceitas, color: '#28a745' },
    { name: 'Despesas Totais', value: totalDespesas, color: '#dc3545' },
  ];

  const dadosDespesasPessoa = pessoas
    .filter((p) => p.totalDespesas > 0)
    .map((p) => ({ name: p.nome, value: p.totalDespesas }));

  return (
    <div style={{ display: 'flex', gap: '20px', margin: '30px 0', flexWrap: 'wrap' }}>
      {/* Gráfico 1: Balanço Geral */}
      <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '10px', color: '#334155' }}>Balanço Residencial Geral</h4>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={dadosGeral} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {dadosGeral.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatarMoeda(Number(value || 0))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 2: Despesas por Morador */}
      <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '10px', color: '#334155' }}>Distribuição de Despesas por Morador</h4>
        {dadosDespesasPessoa.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '80px' }}>Sem despesas registradas.</p>
        ) : (
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dadosDespesasPessoa} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {dadosDespesasPessoa.map((_, index) => (
                    <Cell key={`cell-p-${index}`} fill={CORES_PESSOAS[index % CORES_PESSOAS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatarMoeda(Number(value || 0))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};