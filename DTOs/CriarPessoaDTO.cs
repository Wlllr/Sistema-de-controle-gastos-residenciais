using System.ComponentModel.DataAnnotations;

namespace ControleGastos.API.DTOs
{
    public class CriarPessoaDTO
    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nme deve ter no máximo 100 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Range(0, 150, ErrorMessage = "A idade deve ter um valor entre 0 e 150.")]
        public int Idade { get; set; }
    }
}