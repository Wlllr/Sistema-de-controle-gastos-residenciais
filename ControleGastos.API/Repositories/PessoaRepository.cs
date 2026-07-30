using Microsoft.EntityFrameworkCore;
using ControleGastos.API.Data;
using ControleGastos.API.Models;

namespace ControleGastos.API.Repositories;

public class PessoaRepository : IPessoaRepository
{
    private readonly AppDbContext _context;

    public PessoaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Pessoa>> ObterTodasAsync()
    {
        return await _context.Pessoas.AsNoTracking().ToListAsync();
    }

    public async Task<Pessoa?> ObterPorIdAsync(int id)
    {
        return await _context.Pessoas.FindAsync(id);
    }

    // Busca todas as pessoas incluindo a coleção de transações (necessário para a consulta de Totais)
    public async Task<IEnumerable<Pessoa>> ObterTodasComTransacoesAsync()
    {
        return await _context.Pessoas
            .Include(p => p.Transacoes)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task AdicionarAsync(Pessoa pessoa)
    {
        await _context.Pessoas.AddAsync(pessoa);
        await _context.SaveChangesAsync();
    }

    public async Task ExcluirAsync(Pessoa pessoa)
    {
        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();
    }
}