using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dziennik_elektroniczny.Migrations
{
    /// <inheritdoc />
    public partial class DaysofWeekFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DzienTygodnia",
                table: "Plany");

            migrationBuilder.AddColumn<int>(
                name: "DzienTygodnia",
                table: "Zajecia",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DzienTygodnia",
                table: "Zajecia");

            migrationBuilder.AddColumn<int>(
                name: "DzienTygodnia",
                table: "Plany",
                type: "int",
                nullable: true);
        }
    }
}
