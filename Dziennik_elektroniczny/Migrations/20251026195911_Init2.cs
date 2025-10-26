using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dziennik_elektroniczny.Migrations
{
    /// <inheritdoc />
    public partial class Init2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Zadania_Uzytkownicy_NauczycielId",
                table: "Zadania");

            migrationBuilder.DropForeignKey(
                name: "FK_Zajecia_Uzytkownicy_NauczycielId",
                table: "Zajecia");

            migrationBuilder.DropTable(
                name: "RodzicUczen");

            migrationBuilder.DropColumn(
                name: "DataUrodzenia",
                table: "Uzytkownicy");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Uzytkownicy");

            migrationBuilder.RenameColumn(
                name: "Stan",
                table: "Uzytkownicy",
                newName: "Rola");

            migrationBuilder.AlterColumn<int>(
                name: "WychowawcaId",
                table: "Klasy",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateTable(
                name: "Opieka",
                columns: table => new
                {
                    RodzicId = table.Column<int>(type: "int", nullable: false),
                    UczenId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Opieka", x => new { x.RodzicId, x.UczenId });
                    table.ForeignKey(
                        name: "FK_Opieka_Uzytkownicy_RodzicId",
                        column: x => x.RodzicId,
                        principalTable: "Uzytkownicy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Opieka_Uzytkownicy_UczenId",
                        column: x => x.UczenId,
                        principalTable: "Uzytkownicy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Opieka_UczenId",
                table: "Opieka",
                column: "UczenId");

            migrationBuilder.AddForeignKey(
                name: "FK_Zadania_Uzytkownicy_NauczycielId",
                table: "Zadania",
                column: "NauczycielId",
                principalTable: "Uzytkownicy",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Zajecia_Uzytkownicy_NauczycielId",
                table: "Zajecia",
                column: "NauczycielId",
                principalTable: "Uzytkownicy",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Zadania_Uzytkownicy_NauczycielId",
                table: "Zadania");

            migrationBuilder.DropForeignKey(
                name: "FK_Zajecia_Uzytkownicy_NauczycielId",
                table: "Zajecia");

            migrationBuilder.DropTable(
                name: "Opieka");

            migrationBuilder.RenameColumn(
                name: "Rola",
                table: "Uzytkownicy",
                newName: "Stan");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataUrodzenia",
                table: "Uzytkownicy",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Uzytkownicy",
                type: "varchar(13)",
                maxLength: 13,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<int>(
                name: "WychowawcaId",
                table: "Klasy",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "RodzicUczen",
                columns: table => new
                {
                    DzieciId = table.Column<int>(type: "int", nullable: false),
                    RodziceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RodzicUczen", x => new { x.DzieciId, x.RodziceId });
                    table.ForeignKey(
                        name: "FK_RodzicUczen_Uzytkownicy_DzieciId",
                        column: x => x.DzieciId,
                        principalTable: "Uzytkownicy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RodzicUczen_Uzytkownicy_RodziceId",
                        column: x => x.RodziceId,
                        principalTable: "Uzytkownicy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_RodzicUczen_RodziceId",
                table: "RodzicUczen",
                column: "RodziceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Zadania_Uzytkownicy_NauczycielId",
                table: "Zadania",
                column: "NauczycielId",
                principalTable: "Uzytkownicy",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Zajecia_Uzytkownicy_NauczycielId",
                table: "Zajecia",
                column: "NauczycielId",
                principalTable: "Uzytkownicy",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
