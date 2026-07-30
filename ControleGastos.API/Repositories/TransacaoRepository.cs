using Microsoft.EntityFrameworkCore;
using ControleGastos.API.Data;
using ControleGastos.API.Models;

namespace ControleGastos.API.Repositories;

public class TransacaoRepository : ITransacaoRepository
{
    private readonly AppDbContext _context;

    public TransacaoRepository(AppDbContext context)
    {
        _context = context;
    }

    // Carrega a transação incluindo os dados da Pessoa vinculada
    public async Task<IEnumerable<Transacao>> ObterTodasAsync()
    {
        return await _context.Transacoes
            .Include(t => t.Pessoa)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task AdicionarAsync(Transacao transacao)
    {
        await _context.Transacoes.AddAsync(transacao);
        await _context.SaveChangesAsync();
    }
}