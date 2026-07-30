import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Pessoa } from '../types';
import { FormularioPessoa } from './pessoas/FormularioPessoa';
import { TabelaPessoas } from './pessoas/TabelaPessoas';

export const PessoasPage: React.FC = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    try {
      setLoading(true);
      const response = await api.get<Pessoa[]>('/pessoas');
      setPessoas(response.data);
    } catch {
      console.error('Erro ao buscar pessoas');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarPessoa = async (id: number) => {
    if (window.confirm('Tem certeza? Todas as transações associadas a esta pessoa também serão excluídas.')) {
      try {
        await api.delete(`/pessoas/${id}`);
        carregarPessoas();
      } catch {
        alert('Erro ao excluir pessoa.');
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '10px 20px' }}>
      <h2>👥 Cadastro e Gestão de Pessoas</h2>
      
      <FormularioPessoa onPessoaCadastrada={carregarPessoas} />

      <hr style={{ margin: '25px 0' }} />

      <h3>Pessoas Cadastradas</h3>
      {loading ? <p>Carregando...</p> : <TabelaPessoas pessoas={pessoas} onDeletarPessoa={handleDeletarPessoa} />}
    </div>
  );
};