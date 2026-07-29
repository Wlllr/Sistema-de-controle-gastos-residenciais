using ControleGastos.API.Data;
using ControleGastos.API.DTOs;
using ControleGastos.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGatos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TotaisController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TotaisController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// endpoint para listar todas as transacoes criadas
        /// GET: api/transacoes
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<RelatorioTotaisDto>> RetornaTotais()
        {
            // busca todas as pessoas e suas respectivas transacoes
            var pessoas = await _context.Pessoas
                .Include(p => p.Transacoes)
                .ToListAsync();

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

            var relatorio = new RelatorioTotaisDto
            {
                Pessoas = resumoPessoas,
                TotalGeralReceitas = resumoPessoas.Sum(p => p.TotalReceitas),
                TotalGeralDespesas = resumoPessoas.Sum(p => p.TotalDespesas)
            };

            return Ok(relatorio);
        }
    }
}