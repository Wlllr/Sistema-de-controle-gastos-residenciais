using Microsoft.AspNetCore.Mvc;
using ControleGastos.API.DTOs;
using ControleGastos.API.Models;
using ControleGastos.API.Services;

namespace ControleGastos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacaoService _transacaoService;

    public TransacoesController(ITransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    /// <summary>
    /// Endpoint para listar todas as transações criadas
    /// GET: api/transacoes
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transacao>>> RetornaTransacoes()
    {
        var transacoes = await _transacaoService.ObterTodasAsync();
        return Ok(transacoes);
    }

    /// <summary>
    /// Endpoint para criar uma nova transação
    /// POST: api/transacoes
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Transacao>> CriarTransacao([FromBody] CriarTransacaoDTO dto)
    {
        try
        {
            var transacao = await _transacaoService.CriarAsync(dto);
            return CreatedAtAction(nameof(RetornaTransacoes), new { id = transacao.Id }, transacao);
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }
}