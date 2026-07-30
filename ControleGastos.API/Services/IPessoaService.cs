using ControleGastos.API.DTOs;
using ControleGastos.API.Models;

namespace ControleGastos.API.Services;

public interface IPessoaService
{
    Task<IEnumerable<Pessoa>> ObterTodasAsync();
    Task<Pessoa> CriarAsync(CriarPessoaDTO dto);
    Task ExcluirAsync(int id);
    Task<RelatorioTotaisDto> ObterTotaisAsync();
}