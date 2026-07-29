using ControleGastos.API.Data;
using ControleGastos.API.DTOs;
using ControleGastos.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// endpoint para listar todas as pessoas cadastradas
        /// GET: api/pessoas
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> RetornaPessoas()
        {
            var pessoas = await _context.Pessoas.ToListAsync();
            return Ok(pessoas);
        }

        /// <summary>
        /// endpoint cadastra uma nova pessoa
        /// GET: api/pessoas
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Pessoa>> CriarPessoa([FromBody] CriarPessoaDTO dto)
        {
            var pessoa = new Pessoa
            {
                Nome = dto.Nome,
                Idade = dto.Idade
            };

            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();

            // retorna o HTTP 201 (created)
            return CreatedAtAction(nameof(RetornaPessoas), new { id = pessoa.Id}, pessoa);
        }

        /// <summary>
        /// endpoint remove uma pessoa pelo ID. As transacoes vinculadas seram removidas em cascata
        /// GET: api/pessoas/5
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarPessoa(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null)
            {
                return NotFound(new { mensagem = "Essa pessoa não foi encontrada."});
            }

            // como configuramos o OnDelete no DbContext para ter um comportamento de cascata
            // o Entity Framework e o Sqlite entendem que devem apagar todas transacoes vinculadas a essa pessoa
            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            // HTTP status 204: Sucesso sem conteudo no corpo da resposta
            return NoContent();
        }

    }
}