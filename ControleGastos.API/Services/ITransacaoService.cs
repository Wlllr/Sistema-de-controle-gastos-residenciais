using ControleGastos.API.DTOs;
using ControleGastos.API.Models;

namespace ControleGastos.API.Services;

public interface ITransacaoService
{
    Task<IEnumerable<Transacao>> ObterTodasAsync();
    Task<Transacao> CriarAsync(CriarTransacaoDTO dto);
}