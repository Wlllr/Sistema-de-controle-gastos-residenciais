import { useState } from 'react';
import { PessoasPage } from './components/PessoasPage';
import { TransacoesPage } from './components/TransacoesPage';
import { TotaisPage } from './components/TotaisPage';

export const App: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'pessoas' | 'transacoes' | 'totais'>('pessoas');

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      {/* Cabeçalho ocupando 100% da largura */}
      <header style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '24px 0', textAlign: 'center', width: '100%' }}>
        <h1 style={{ margin: 0, fontSize: '1.75em' }}>🏠 Controle de Gastos Residenciais</h1>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '0.9em' }}>
          Desafio Técnico Full Stack (.NET 8 + React + TypeScript)
        </p>
      </header>

      {/* Menu de Abas em 100% */}
      <nav style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', width: '100%' }}>
        <button
          onClick={() => setAbaAtiva('pessoas')}
          style={{
            padding: '16px 32px',
            border: 'none',
            borderBottom: abaAtiva === 'pessoas' ? '3px solid #2563eb' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: abaAtiva === 'pessoas' ? '#2563eb' : '#64748b',
            fontWeight: abaAtiva === 'pessoas' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '1em',
          }}
        >
          👥 Pessoas
        </button>

        <button
          onClick={() => setAbaAtiva('transacoes')}
          style={{
            padding: '16px 32px',
            border: 'none',
            borderBottom: abaAtiva === 'transacoes' ? '3px solid #2563eb' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: abaAtiva === 'transacoes' ? '#2563eb' : '#64748b',
            fontWeight: abaAtiva === 'transacoes' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '1em',
          }}
        >
          💸 Transações
        </button>

        <button
          onClick={() => setAbaAtiva('totais')}
          style={{
            padding: '16px 32px',
            border: 'none',
            borderBottom: abaAtiva === 'totais' ? '3px solid #2563eb' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: abaAtiva === 'totais' ? '#2563eb' : '#64748b',
            fontWeight: abaAtiva === 'totais' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '1em',
          }}
        >
          📊 Consulta de Totais
        </button>
      </nav>

      {/* Conteúdo centralizado de forma ampla */}
      <main style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {abaAtiva === 'pessoas' && <PessoasPage />}
        {abaAtiva === 'transacoes' && <TransacoesPage />}
        {abaAtiva === 'totais' && <TotaisPage />}
      </main>
    </div>
  );
};

export default App;