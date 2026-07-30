using Xunit;
using Moq;
using FluentAssertions;
using ControleGastos.API.Services;
using ControleGastos.API.Repositories;
using ControleGastos.API.Models;

namespace ControleGastos.Tests.Services;

public class PessoaServiceTests
{
    private readonly Mock<IPessoaRepository> _pessoaRepoMock;
    private readonly PessoaService _pessoaService;

    public PessoaServiceTests()
    {
        _pessoaRepoMock = new Mock<IPessoaRepository>();
        _pessoaService = new PessoaService(_pessoaRepoMock.Object);
    }

    [Fact]
    public async Task ObterTotaisAsync_DeveCalcularTotaisESaldosCorretamente()
    {
        // Arrange - Criando dados simulados em memória
        var pessoasMock = new List<Pessoa>
        {
            new Pessoa
            {
                Id = 1,
                Nome = "Carlos",
                Idade = 30,
                Transacoes = new List<Transacao>
                {
                    new Transacao { Valor = 3000, Tipo = TipoTransacao.Receita },
                    new Transacao { Valor = 1000, Tipo = TipoTransacao.Despesa }
                }
            },
            new Pessoa
            {
                Id = 2,
                Nome = "Ana",
                Idade = 25,
                Transacoes = new List<Transacao>
                {
                    new Transacao { Valor = 500, Tipo = TipoTransacao.Despesa }
                }
            }
        };

        _pessoaRepoMock.Setup(r => r.ObterTodasComTransacoesAsync())
                       .ReturnsAsync(pessoasMock);

        // Act
        var relatorio = await _pessoaService.ObterTotaisAsync();

        // Assert
        relatorio.Should().NotBeNull();

        // Valida Totais Gerais
        relatorio.TotalGeralReceitas.Should().Be(3000);
        relatorio.TotalGeralDespesas.Should().Be(1500);
        relatorio.SaldoLiquidoGeral.Should().Be(1500); // 3000 - 1500

        // Valida totais de Carlos (Id = 1)
        var carlos = relatorio.Pessoas.First(p => p.Id == 1);
        carlos.TotalReceitas.Should().Be(3000);
        carlos.TotalDespesas.Should().Be(1000);
        carlos.Saldo.Should().Be(2000);

        // Valida totais de Ana (Id = 2)
        var ana = relatorio.Pessoas.First(p => p.Id == 2);
        ana.TotalReceitas.Should().Be(0);
        ana.TotalDespesas.Should().Be(500);
        ana.Saldo.Should().Be(-500);
    }
}