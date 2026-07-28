namespace ControleGastos.API.Models
{
    public class Transacao
    {
        // Chave primaria da transacao
        public int Id { get; set; }
        
        public string Descricao { get; set; } = string.Empty;

        public decimal Valor { get; set; }

        public TipoTransacao tipo { get; set; }

        // Chave estrangeira (eh o identificador de outra entidade que usamos para conectar a nossa entidade atual a outra)
        public int PessoaId { get; set; } // N para 1

        public Pessoa? Pessoa { get; set; }
    }
}