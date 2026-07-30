using System.ComponentModel.DataAnnotations;
using ControleGastos.API.Models;

namespace ControleGastos.API.DTOs
{
    public class CriarTransacaoDTO
    {
        [Required(ErrorMessage = "A descrição é obrigatória.")]
        public string Descricao { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
        public decimal Valor { get; set; }

        [EnumDataType(typeof(TipoTransacao), ErrorMessage = "Tipo inválido. Use 1 para Despesa ou 2 para Receita.")]
        public TipoTransacao Tipo { get; set; }

        [Required(ErrorMessage = "O identificador da pessoa é obrigatório.")]
        public int PessoaId { get; set;}
    }
}