using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dziennik_elektroniczny.Migrations
{
    /// <inheritdoc />
    public partial class UzytkownikUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UzytkownikId",
                table: "Przedmioty",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UzytkownikId",
                table: "Klasy",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Przedmioty_UzytkownikId",
                table: "Przedmioty",
                column: "UzytkownikId");

            migrationBuilder.CreateIndex(
                name: "IX_Klasy_UzytkownikId",
                table: "Klasy",
                column: "UzytkownikId");

            migrationBuilder.AddForeignKey(
                name: "FK_Klasy_Uzytkownicy_UzytkownikId",
                table: "Klasy",
                column: "UzytkownikId",
                principalTable: "Uzytkownicy",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Przedmioty_Uzytkownicy_UzytkownikId",
                table: "Przedmioty",
                column: "UzytkownikId",
                principalTable: "Uzytkownicy",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Klasy_Uzytkownicy_UzytkownikId",
                table: "Klasy");

            migrationBuilder.DropForeignKey(
                name: "FK_Przedmioty_Uzytkownicy_UzytkownikId",
                table: "Przedmioty");

            migrationBuilder.DropIndex(
                name: "IX_Przedmioty_UzytkownikId",
                table: "Przedmioty");

            migrationBuilder.DropIndex(
                name: "IX_Klasy_UzytkownikId",
                table: "Klasy");

            migrationBuilder.DropColumn(
                name: "UzytkownikId",
                table: "Przedmioty");

            migrationBuilder.DropColumn(
                name: "UzytkownikId",
                table: "Klasy");
        }
    }
}
