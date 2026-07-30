import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Pessoa, TipoTransacao } from '../../types';

interface FormularioTransacaoProps {
  pessoas: Pessoa[];
  onTransacaoCadastrada: () => void;
}

export const FormularioTransacao: React.FC<FormularioTransacaoProps> = ({ pessoas, onTransacaoCadastrada }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number | ''>('');
  const [tipo, setTipo] = useState<TipoTransacao>(TipoTransacao.Despesa);
  const [pessoaId, setPessoaId] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const pessoaSelecionada = pessoas.find((p) => p.id === Number(pessoaId));
  const ehMenorDeIdade = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false;

  useEffect(() => {
    if (ehMenorDeIdade) {
      setTipo(TipoTransacao.Despesa);
    }
  }, [ehMenorDeIdade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!descricao.trim() || valor === '' || pessoaId === '') {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/transacoes', {
        descricao,
        valor: Number(valor),
        tipo: Number(tipo),
        pessoaId: Number(pessoaId),
      });

      setDescricao('');
      setValor('');
      setPessoaId('');
      setTipo(TipoTransacao.Despesa);
      onTransacaoCadastrada();
    } catch {
      setErro('Erro ao registrar transação.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', minWidth: '200px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Descrição:</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Supermercado, Salário..."
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ flex: '1', minWidth: '120px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Valor (R$):</label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="0.00"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Pessoa Responsável:</label>
          <select
            value={pessoaId}
            onChange={(e) => setPessoaId(e.target.value === '' ? '' : Number(e.target.value))}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Selecione uma pessoa...</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.idade} anos)
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Tipo de Transação:</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(Number(e.target.value) as TipoTransacao)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value={TipoTransacao.Despesa}>💸 Despesa</option>
            <option value={TipoTransacao.Receita} disabled={ehMenorDeIdade}>
              💰 Receita {ehMenorDeIdade ? '(Bloqueado para Menores)' : ''}
            </option>
          </select>
        </div>
      </div>

      {ehMenorDeIdade && (
        <p style={{ color: '#d97706', fontSize: '0.85em', margin: 0, fontWeight: 'bold' }}>
          ⚠️ Menores de idade podem registrar apenas despesas.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          padding: '12px 20px',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        {submitting ? 'Salvando...' : 'Registrar Transação'}
      </button>

      {erro && <p style={{ color: '#dc3545', marginTop: '5px' }}>{erro}</p>}
    </form>
  );
};