using Microsoft.AspNetCore.Mvc;
using ControleGastos.API.DTOs;
using ControleGastos.API.Models;
using ControleGastos.API.Services;

namespace ControleGastos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    // A Controller agora recebe apenas a abstração do Serviço
    public PessoasController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    /// <summary>
    /// Endpoint para listar todas as pessoas cadastradas
    /// GET: api/pessoas
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pessoa>>> RetornaPessoas()
    {
        var pessoas = await _pessoaService.ObterTodasAsync();
        return Ok(pessoas);
    }

    /// <summary>
    /// Endpoint cadastra uma nova pessoa
    /// POST: api/pessoas
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Pessoa>> CriarPessoa([FromBody] CriarPessoaDTO dto)
    {
        var pessoa = await _pessoaService.CriarAsync(dto);
        return CreatedAtAction(nameof(RetornaPessoas), new { id = pessoa.Id }, pessoa);
    }

    /// <summary>
    /// Endpoint remove uma pessoa pelo ID. As transações vinculadas serão removidas em cascata
    /// DELETE: api/pessoas/5
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletarPessoa(int id)
    {
        try
        {
            await _pessoaService.ExcluirAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
    }
}