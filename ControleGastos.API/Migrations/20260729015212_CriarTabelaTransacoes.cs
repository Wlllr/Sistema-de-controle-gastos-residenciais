using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControleGastos.API.Migrations
{
    /// <inheritdoc />
    public partial class CriarTabelaTransacoes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transacao_Pessoas_PessoaId",
                table: "Transacao");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Transacao",
                table: "Transacao");

            migrationBuilder.RenameTable(
                name: "Transacao",
                newName: "Transacoes");

            migrationBuilder.RenameColumn(
                name: "tipo",
                table: "Transacoes",
                newName: "Tipo");

            migrationBuilder.RenameIndex(
                name: "IX_Transacao_PessoaId",
                table: "Transacoes",
                newName: "IX_Transacoes_PessoaId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Transacoes",
                table: "Transacoes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transacoes_Pessoas_PessoaId",
                table: "Transacoes",
                column: "PessoaId",
                principalTable: "Pessoas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transacoes_Pessoas_PessoaId",
                table: "Transacoes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Transacoes",
                table: "Transacoes");

            migrationBuilder.RenameTable(
                name: "Transacoes",
                newName: "Transacao");

            migrationBuilder.RenameColumn(
                name: "Tipo",
                table: "Transacao",
                newName: "tipo");

            migrationBuilder.RenameIndex(
                name: "IX_Transacoes_PessoaId",
                table: "Transacao",
                newName: "IX_Transacao_PessoaId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Transacao",
                table: "Transacao",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transacao_Pessoas_PessoaId",
                table: "Transacao",
                column: "PessoaId",
                principalTable: "Pessoas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
