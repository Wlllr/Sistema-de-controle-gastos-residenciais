//componentizando para que fique melhor de ler e com responsabilidades melhor divididas
import { useState } from 'react';
import { api } from '../../services/api';

interface FormularioPessoaProps {
  onPessoaCadastrada: () => void;
}

export const FormularioPessoa: React.FC<FormularioPessoaProps> = ({ onPessoaCadastrada }) => {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!nome.trim() || idade === '') {
      setErro('Preencha o nome e a idade corretamente.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/pessoas', { nome, idade: Number(idade) });
      setNome('');
      setIdade('');
      onPessoaCadastrada();
    } catch {
      setErro('Erro ao cadastrar pessoa. Verifique os dados.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '25px' }}>
      <div style={{ flex: '2', minWidth: '200px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Nome Completo:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Maria Silva"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ flex: '1', minWidth: '100px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Idade:</label>
        <input
          type="number"
          value={idade}
          onChange={(e) => setIdade(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Ex: 25"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0066cc',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        {submitting ? 'Cadastrando...' : 'Cadastrar Pessoa'}
      </button>

      {erro && <p style={{ color: '#dc3545', width: '100%', marginTop: '5px' }}>{erro}</p>}
    </form>
  );
};