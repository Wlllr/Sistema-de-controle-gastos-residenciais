using ControleGastos.API.Models;

namespace ControleGastos.API.Repositories;

/// <summary>
/// Contrato do repositório de Pessoas.
/// Permite desacoplar a camada de negócio (Service) do acesso direto ao banco de dados.
/// </summary>
public interface IPessoaRepository
{
    Task<IEnumerable<Pessoa>> ObterTodasAsync();
    Task<Pessoa?> ObterPorIdAsync(int id);
    Task<IEnumerable<Pessoa>> ObterTodasComTransacoesAsync();
    Task AdicionarAsync(Pessoa pessoa);
    Task ExcluirAsync(Pessoa pessoa);
}