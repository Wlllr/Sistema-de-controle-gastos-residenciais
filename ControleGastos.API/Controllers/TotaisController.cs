using Microsoft.AspNetCore.Mvc;
using ControleGastos.API.DTOs;
using ControleGastos.API.Services;

namespace ControleGastos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TotaisController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    public TotaisController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    /// <summary>
    /// Endpoint para consultar totais gerais de receitas e despesas por pessoa e no geral
    /// GET: api/totais
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<RelatorioTotaisDto>> RetornaTotais()
    {
        var relatorio = await _pessoaService.ObterTotaisAsync();
        return Ok(relatorio);
    }
}