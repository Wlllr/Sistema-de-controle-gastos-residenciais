using Xunit;
using Moq;
using FluentAssertions;
using ControleGastos.API.Services;
using ControleGastos.API.Repositories;
using ControleGastos.API.Models;
using ControleGastos.API.DTOs;

namespace ControleGastos.Tests.Services;

public class TransacaoServiceTests
{
    private readonly Mock<ITransacaoRepository> _transacaoRepoMock;
    private readonly Mock<IPessoaRepository> _pessoaRepoMock;
    private readonly TransacaoService _transacaoService;

    public TransacaoServiceTests()
    {
        // Instanciamos os Mocks (simuladores de banco/repositório)
        _transacaoRepoMock = new Mock<ITransacaoRepository>();
        _pessoaRepoMock = new Mock<IPessoaRepository>();

        // Injetamos os mocks na Service real que será testada
        _transacaoService = new TransacaoService(_transacaoRepoMock.Object, _pessoaRepoMock.Object);
    }

    [Fact]
    public async Task CriarAsync_QuandoPessoaForMenorDeIdadeEReceita_DeveLancarInvalidOperationException()
    {
        // Arrange (Preparação)
        var pessoaMenor = new Pessoa { Id = 1, Nome = "Lucas", Idade = 15 };
        var dtoReceita = new CriarTransacaoDTO
        {
            PessoaId = 1,
            Descricao = "Mesada",
            Valor = 100,
            Tipo = TipoTransacao.Receita
        };

        // Simula que o repositório encontra o menor de idade
        _pessoaRepoMock.Setup(r => r.ObterPorIdAsync(1))
                       .ReturnsAsync(pessoaMenor);

        // Act (Ação)
        Func<Task> acao = async () => await _transacaoService.CriarAsync(dtoReceita);

        // Assert (Verificação)
        await acao.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*menor de idade*");

        // Garante que NUNCA tentou salvar no banco de dados
        _transacaoRepoMock.Verify(r => r.AdicionarAsync(It.IsAny<Transacao>()), Times.Never);
    }

    [Fact]
    public async Task CriarAsync_QuandoPessoaForMenorDeIdadeEDespesa_DeveCriarComSucesso()
    {
        // Arrange
        var pessoaMenor = new Pessoa { Id = 1, Nome = "Lucas", Idade = 15 };
        var dtoDespesa = new CriarTransacaoDTO
        {
            PessoaId = 1,
            Descricao = "Lanche Escolar",
            Valor = 20,
            Tipo = TipoTransacao.Despesa
        };

        _pessoaRepoMock.Setup(r => r.ObterPorIdAsync(1))
                       .ReturnsAsync(pessoaMenor);

        // Act
        var resultado = await _transacaoService.CriarAsync(dtoDespesa);

        // Assert
        resultado.Should().NotBeNull();
        resultado.Valor.Should().Be(20);
        
        // Garante que O MÉTODO de adicionar ao banco foi chamado exatamente 1 vez
        _transacaoRepoMock.Verify(r => r.AdicionarAsync(It.IsAny<Transacao>()), Times.Once);
    }
}