using ControleGastos.API.Models;

namespace ControleGastos.API.Repositories;

public interface ITransacaoRepository
{
    Task<IEnumerable<Transacao>> ObterTodasAsync();
    Task AdicionarAsync(Transacao transacao);
}