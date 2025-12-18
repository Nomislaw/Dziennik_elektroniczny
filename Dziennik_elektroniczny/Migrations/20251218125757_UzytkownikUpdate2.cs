using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dziennik_elektroniczny.Migrations
{
    /// <inheritdoc />
    public partial class UzytkownikUpdate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "KlasaUzytkownik",
                columns: table => new
                {
                    KlasyId = table.Column<int>(type: "int", nullable: false),
                    UzytkownikId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KlasaUzytkownik", x => new { x.KlasyId, x.UzytkownikId });
                    table.ForeignKey(
                        name: "FK_KlasaUzytkownik_Klasy_KlasyId",
                        column: x => x.KlasyId,
                        principalTable: "Klasy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KlasaUzytkownik_Uzytkownicy_UzytkownikId",
                        column: x => x.UzytkownikId,
                        principalTable: "Uzytkownicy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PrzedmiotUzytkownik",
                columns: table => new
                {
                    PrzedmiotyId = table.Column<int>(type: "int", nullable: false),
                    UzytkownikId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrzedmiotUzytkownik", x => new { x.PrzedmiotyId, x.UzytkownikId });
                    table.ForeignKey(
                        name: "FK_PrzedmiotUzytkownik_Przedmioty_PrzedmiotyId",
                        column: x => x.PrzedmiotyId,
                        principalTable: "Przedmioty",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PrzedmiotUzytkownik_Uzytkownicy_UzytkownikId",
                        column: x => x.UzytkownikId,
                        principalTable: "Uzytkownicy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_KlasaUzytkownik_UzytkownikId",
                table: "KlasaUzytkownik",
                column: "UzytkownikId");

            migrationBuilder.CreateIndex(
                name: "IX_PrzedmiotUzytkownik_UzytkownikId",
                table: "PrzedmiotUzytkownik",
                column: "UzytkownikId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KlasaUzytkownik");

            migrationBuilder.DropTable(
                name: "PrzedmiotUzytkownik");

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
    }
}
