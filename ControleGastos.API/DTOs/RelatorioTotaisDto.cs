namespace ControleGastos.API.DTOs
{
    public class ResumoPessoaDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo => TotalReceitas - TotalDespesas;
    }

    public class RelatorioTotaisDto
    {
        public List<ResumoPessoaDto> Pessoas { get; set; } = new();
        public decimal TotalGeralReceitas { get; set; }
        public decimal TotalGeralDespesas { get; set; }
        public decimal SaldoLiquidoGeral => TotalGeralReceitas - TotalGeralDespesas;
    }
}