using ControleGastos.API.Data;
using ControleGastos.API.DTOs;
using ControleGastos.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacoesController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// endpoint para listar todas as transacoes criadas
        /// GET: api/transacoes
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transacao>>> RetornaTransacoes()
        {
            var transacoes = await _context.Transacoes
                .Include(t => t.Pessoa) // carrega os dados da pessoa vinculada a transacao
                .ToListAsync();

            return Ok(transacoes);
        }

        /// <summary>
        /// endpoint para criar uma nova transacao 
        /// GET: api/transacoes
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Transacao>> CriarTransacao([FromBody] CriarTransacaoDto dto)
        {
            // valida se tem um registro dessa pessoa cadastrado
            var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
            if (pessoa == null)
            {
                return BadRequest(new { mensagem = "Não existe cadastro para a pessoa informada." });
            }

            // valida se a pessoa eh menor de idade, caso seja, so registra despesas
            if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
            {
                return BadRequest(new {
                    mensagem = $"A pessoa '{pessoa.Nome}' é menor de idade ({pessoa.Idade} anos) e não pode possuir receitas, apenas despesas."
                });
            }

            // segue o fluxo para mapear o DTO para a entidade
            var transacao = new Transacao
            {
                Descricao = dto.Descricao,
                Valor = dto.Valor,
                Tipo = dto.Tipo,
                PessoaId = dto.PessoaId
            };

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(RetornaTransacoes), new { id = transacao.Id }, transacao);
        }

    }
}