using ControleGastos.API.DTOs;
using ControleGastos.API.Models;
using ControleGastos.API.Repositories;

namespace ControleGastos.API.Services;

public class TransacaoService : ITransacaoService
{
    private readonly ITransacaoRepository _transacaoRepository;
    private readonly IPessoaRepository _pessoaRepository;

    public TransacaoService(ITransacaoRepository transacaoRepository, IPessoaRepository pessoaRepository)
    {
        _transacaoRepository = transacaoRepository;
        _pessoaRepository = pessoaRepository;
    }

    public async Task<IEnumerable<Transacao>> ObterTodasAsync()
    {
        return await _transacaoRepository.ObterTodasAsync();
    }

    public async Task<Transacao> CriarAsync(CriarTransacaoDTO dto)
    {
        // 1. Valida se a pessoa existe no banco de dados
        var pessoa = await _pessoaRepository.ObterPorIdAsync(dto.PessoaId);
        if (pessoa == null)
        {
            throw new KeyNotFoundException("Não existe cadastro para a pessoa informada.");
        }

        // 2. Valida a Regra de Negócio: Menores de 18 anos só podem ter Despesas
        if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
        {
            throw new InvalidOperationException($"A pessoa '{pessoa.Nome}' é menor de idade ({pessoa.Idade} anos) e não pode possuir receitas, apenas despesas.");
        }

        // 3. Mapeia DTO -> Entidade
        var transacao = new Transacao
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            PessoaId = dto.PessoaId
        };

        await _transacaoRepository.AdicionarAsync(transacao);
        return transacao;
    }
}