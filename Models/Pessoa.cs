using System.Text.Json.Serialization;

namespace ControleGastos.API.Models 
{
    public class Pessoa
    {
        // Chave primaria (O identificador unico da Pessoa)
        public int Id { get; set; }

        public string Nome { get; set; } = string.Empty;

        public int Idade { get; set; }

        // Uma Pessoa por ter N transacoes
        [JsonIgnore] // Anotacao que impede que ao listar entre em um loop na serialization
        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}