using ControleGastos.API.DTOs;
using ControleGastos.API.Models;
using ControleGastos.API.Repositories;

namespace ControleGastos.API.Services;

public class PessoaService : IPessoaService
{
    private readonly IPessoaRepository _pessoaRepository;

    public PessoaService(IPessoaRepository pessoaRepository)
    {
        _pessoaRepository = pessoaRepository;
    }

    public async Task<IEnumerable<Pessoa>> ObterTodasAsync()
    {
        return await _pessoaRepository.ObterTodasAsync();
    }

    public async Task<Pessoa> CriarAsync(CriarPessoaDTO dto)
    {
        // Mapeamento do DTO para a Entidade
        var pessoa = new Pessoa
        {
            Nome = dto.Nome,
            Idade = dto.Idade
        };

        await _pessoaRepository.AdicionarAsync(pessoa);
        return pessoa;
    }

    public async Task ExcluirAsync(int id)
    {
        var pessoa = await _pessoaRepository.ObterPorIdAsync(id);
        if (pessoa == null)
        {
            // Lança exceção específica para ser capturada pelo Controller e mapeada para 404 Not Found
            throw new KeyNotFoundException("Essa pessoa não foi encontrada.");
        }

        await _pessoaRepository.ExcluirAsync(pessoa);
    }

    // Regra do Relatório de Totais transferida do TotaisController para o Serviço
    public async Task<RelatorioTotaisDto> ObterTotaisAsync()
    {
        var pessoas = await _pessoaRepository.ObterTodasComTransacoesAsync();

        var resumoPessoas = pessoas.Select(p => new ResumoPessoaDto
        {
            Id = p.Id,
            Nome = p.Nome,
            Idade = p.Idade,
            TotalReceitas = p.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Receita)
                .Sum(t => t.Valor),
            TotalDespesas = p.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Despesa)
                .Sum(t => t.Valor)
        }).ToList();

        return new RelatorioTotaisDto
        {
            Pessoas = resumoPessoas,
            TotalGeralReceitas = resumoPessoas.Sum(p => p.TotalReceitas),
            TotalGeralDespesas = resumoPessoas.Sum(p => p.TotalDespesas)
        };
    }
}