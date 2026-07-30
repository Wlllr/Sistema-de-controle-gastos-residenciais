import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Pessoa, Transacao, TipoTransacao, CriarTransacaoDto } from '../types';

export const TransacoesPage: React.FC = () => {
  // Estados para carregar dados externos
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  // Campos do Formulário
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number | ''>('');
  const [tipo, setTipo] = useState<TipoTransacao>(TipoTransacao.Despesa);
  const [pessoaId, setPessoaId] = useState<number | ''>('');

  // Estados de Controle de UX e Feedback
  const [pessoaSelecionada, setPessoaSelecionada] = useState<Pessoa | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Carrega a lista de pessoas e transações ao abrir a página
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resPessoas, resTransacoes] = await Promise.all([
        api.get<Pessoa[]>('/pessoas'),
        api.get<Transacao[]>('/transacoes'),
      ]);
      setPessoas(resPessoas.data);
      setTransacoes(resTransacoes.data);
    } catch (err) {
      setErro('Erro ao carregar dados da API. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Efeito Reativo: Sempre que o usuário mudar a Pessoa selecionada
  const handlePessoaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value === '' ? '' : Number(e.target.value);
    setPessoaId(id);

    if (id !== '') {
      const pessoaEncontrada = pessoas.find((p) => p.id === id) || null;
      setPessoaSelecionada(pessoaEncontrada);

      // REGRA DE UX: Se for menor de idade, força o tipo para Despesa imediatamente
      if (pessoaEncontrada && pessoaEncontrada.idade < 18) {
        setTipo(TipoTransacao.Despesa);
      }
    } else {
      setPessoaSelecionada(null);
    }
  };

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    // Validações
    if (!descricao.trim()) {
      setErro('Informe uma descrição para a transação.');
      return;
    }
    if (valor === '' || valor <= 0) {
      setErro('O valor da transação deve ser maior que zero.');
      return;
    }
    if (pessoaId === '') {
      setErro('Selecione a pessoa responsável pela transação.');
      return;
    }

    try {
      const novaTransacao: CriarTransacaoDto = {
        descricao: descricao.trim(),
        valor: Number(valor),
        tipo: Number(tipo),
        pessoaId: Number(pessoaId),
      };

      await api.post('/transacoes', novaTransacao);

      setSucesso('Transação cadastrada com sucesso!');
      setDescricao('');
      setValor('');
      carregarDados(); // Atualiza a tabela com a nova transação
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || 'Erro ao cadastrar transação.';
      setErro(msg);
    }
  };

  // Função auxiliar para formatação de moeda em Reais (R$)
  const formatarMoeda = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>💸 Cadastro e Histórico de Transações</h2>

      {/* Alertas visuais de UX */}
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

      {/* Formulário de Transação */}
      <form onSubmit={handleCadastrar} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          
          {/* Seletor de Pessoa */}
          <div style={{ flex: '2', minWidth: '220px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Pessoa Responsável:</label>
            <select
              value={pessoaId}
              onChange={handlePessoaChange}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              <option value="">-- Selecione uma pessoa --</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} ({p.idade} anos) {p.idade < 18 ? '👶 Menor' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Seletor de Tipo de Transação */}
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tipo de Transação:</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(Number(e.target.value) as TipoTransacao)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              <option value={TipoTransacao.Despesa}>🔴 Despesa</option>
              <option
                value={TipoTransacao.Receita}
                disabled={pessoaSelecionada ? pessoaSelecionada.idade < 18 : false}
              >
                🟢 Receita {pessoaSelecionada && pessoaSelecionada.idade < 18 ? '(Bloqueado)' : ''}
              </option>
            </select>
          </div>
        </div>

        {/* Aviso explicativo em tempo real para menor de idade */}
        {pessoaSelecionada && pessoaSelecionada.idade < 18 && (
          <div style={{ padding: '8px 12px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', fontSize: '0.9em' }}>
            ℹ️ <strong>Aviso de Regra de Negócio:</strong> A pessoa selecionada (<strong>{pessoaSelecionada.nome}</strong>) é menor de idade ({pessoaSelecionada.idade} anos). De acordo com as regras do sistema, apenas <strong>Despesas</strong> são permitidas.
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {/* Descrição */}
          <div style={{ flex: '3', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descrição:</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Aluguel, Supermercado, Mesada"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Valor */}
          <div style={{ flex: '1', minWidth: '120px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Valor (R$):</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0,00"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            alignSelf: 'flex-start',
          }}
        >
          Salvar Transação
        </button>
      </form>

      <hr />

      {/* Tabela de Transações */}
      <h3>Histórico de Transações Cadastradas</h3>
      {loading ? (
        <p>Carregando transações...</p>
      ) : transacoes.length === 0 ? (
        <p>Nenhuma transação registrada até o momento.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Descrição</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Pessoa</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Tipo</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{t.id}</td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{t.descricao}</td>
                <td style={{ padding: '10px' }}>{t.pessoa ? t.pessoa.nome : `Pessoa #${t.pessoaId}`}</td>
                <td style={{ padding: '10px' }}>
                  {t.tipo === TipoTransacao.Receita ? (
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>🟢 Receita</span>
                  ) : (
                    <span style={{ color: '#dc3545', fontWeight: 'bold' }}>🔴 Despesa</span>
                  )}
                </td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: t.tipo === TipoTransacao.Receita ? '#28a745' : '#dc3545' }}>
                  {t.tipo === TipoTransacao.Receita ? '+' : '-'} {formatarMoeda(t.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};