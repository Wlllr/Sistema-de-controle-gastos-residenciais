using ControleGastos.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.API.Data
{
    // O AppDbContext herda da classe base DbContext do EntityFramework
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Representacao das tableas no banco de dados
        public DbSet<Pessoa> Pessoas { get; set; }

        // tive que comentar essa linha. Estava dando erro no build
        // aparentemente, o .net nao da conflito nao reconhecendo o enum como tipo, o considerando um struct
        //public DbSet<TipoTransacao> Transacoes { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Mapeando o relacionamento de 1 Pessoa para N transacoes
            modelBuilder.Entity<Transacao>()
                .HasOne(t => t.Pessoa) // Uma transacao pertence a uma unica pessoa
                .WithMany(p => p.Transacoes) // Cada Pessoa por ter varias transacoes
                .HasForeignKey(t => t.PessoaId) // Chave estrangeira de pessoa eh o que conecta a entidade pessoa a transacao
                .OnDelete(DeleteBehavior.Cascade); // requisito do desafio. Delecao em cascata, apagou a pessoa o banco apaga as transacoes da pessoa
        }
    }
}