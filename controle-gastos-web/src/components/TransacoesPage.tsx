import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Pessoa, Transacao } from '../types';
import { FormularioTransacao } from './transacoes/FormularioTransacao';
import { TabelaTransacoes } from './transacoes/TabelaTransacoes';

export const TransacoesPage: React.FC = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resTransacoes, resPessoas] = await Promise.all([
        api.get<Transacao[]>('/transacoes'),
        api.get<Pessoa[]>('/pessoas'),
      ]);
      setTransacoes(resTransacoes.data);
      setPessoas(resPessoas.data);
    } catch {
      console.error('Erro ao carregar transações/pessoas');
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '10px 20px' }}>
      <h2>💸 Registro de Transações</h2>

      <FormularioTransacao pessoas={pessoas} onTransacaoCadastrada={carregarDados} />

      <hr style={{ margin: '25px 0' }} />

      <h3>Histórico de Transações</h3>
      {loading ? <p>Carregando...</p> : <TabelaTransacoes transacoes={transacoes} formatarMoeda={formatarMoeda} />}
    </div>
  );
};