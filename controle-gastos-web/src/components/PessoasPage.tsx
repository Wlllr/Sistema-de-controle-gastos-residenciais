import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Pessoa, CriarPessoaDto } from '../types';

export const PessoasPage: React.FC = () => {
  // Estados para armazenar a lista de pessoas e o formulário
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState<number | ''>('');
  
  // Estados de controle de UX (Loading e Feedback)
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Carrega as pessoas cadastradas ao montar o componente
  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    try {
      setLoading(true);
      const response = await api.get<Pessoa[]>('/pessoas');
      setPessoas(response.data);
    } catch (err) {
      setErro('Erro ao carregar a lista de pessoas. Verifique se o servidor back-end está ativo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    // Validações básicas de front-end
    if (!nome.trim()) {
      setErro('Por favor, informe o nome da pessoa.');
      return;
    }
    if (idade === '' || idade < 0) {
      setErro('Por favor, informe uma idade válida.');
      return;
    }

    try {
      const novaPessoa: CriarPessoaDto = {
        nome: nome.trim(),
        idade: Number(idade),
      };

      await api.post('/pessoas', novaPessoa);
      
      // Limpa os campos do formulário
      setNome('');
      setIdade('');
      setSucesso('Pessoa cadastrada com sucesso!');
      
      // Atualiza a lista na tela sem precisar recarregar a página
      carregarPessoas();
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || 'Erro ao cadastrar pessoa.';
      setErro(msg);
    }
  };

  const handleDeletar = async (id: number, nomePessoa: string) => {
    // Alerta de confirmação reforçando a regra de negócio da deleção em cascata
    const confirmacao = window.confirm(
      `Tem certeza que deseja apagar "${nomePessoa}"?\n\n⚠️ ATENÇÃO: Todas as transações vinculadas a esta pessoa também serão apagadas permanentemente.`
    );

    if (!confirmacao) return;

    try {
      setErro(null);
      await api.delete(`/pessoas/${id}`);
      setSucesso(`Pessoa "${nomePessoa}" e suas transações foram removidas com sucesso.`);
      carregarPessoas();
    } catch (err) {
      setErro('Erro ao apagar pessoa. Tente novamente.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>👥 Cadastro e Gestão de Pessoas</h2>

      {/* Exibição de Alertas de Feedback para UX */}
      {erro && (
        <div style={{ padding: '10px 15px', backgroundColor: '#ffe6e6', color: '#cc0000', borderRadius: '4px', marginBottom: '15px' }}>
          {erro}
        </div>
      )}
      {sucesso && (
        <div style={{ padding: '10px 15px', backgroundColor: '#e6ffe6', color: '#008000', borderRadius: '4px', marginBottom: '15px' }}>
          {sucesso}
        </div>
      )}

      {/* Formulário de Cadastro */}
      <form onSubmit={handleCadastrar} style={{ display: 'flex', gap: '10px', marginBottom: '30px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome Completo:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Maria Silva"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ flex: '1', minWidth: '100px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Idade:</label>
          <input
            type="number"
            value={idade}
            onChange={(e) => setIdade(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Ex: 25"
            min="0"
            max="150"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Cadastrar Pessoa
        </button>
      </form>

      <hr />

      {/* Tabela de Listagem */}
      <h3>Pessoas Cadastradas</h3>
      {loading ? (
        <p>Carregando pessoas...</p>
      ) : pessoas.length === 0 ? (
        <p>Nenhuma pessoa cadastrada até o momento.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Nome</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Idade</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Categoria</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd', textAlign: 'center' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.map((pessoa) => (
              <tr key={pessoa.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{pessoa.id}</td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{pessoa.nome}</td>
                <td style={{ padding: '10px' }}>{pessoa.idade} anos</td>
                <td style={{ padding: '10px' }}>
                  {pessoa.idade < 18 ? (
                    <span style={{ color: '#d9534f', fontWeight: 'bold', fontSize: '0.85em' }}>
                      👶 Menor de Idade (Apenas Despesas)
                    </span>
                  ) : (
                    <span style={{ color: '#5cb85c', fontWeight: 'bold', fontSize: '0.85em' }}>
                      👤 Maior de Idade
                    </span>
                  )}
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDeletar(pessoa.id, pessoa.nome)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#d9534f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};