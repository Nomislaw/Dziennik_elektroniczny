namespace Dziennik_elektroniczny.Data;

using Dziennik_elektroniczny.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Definicja tabel w bazie danych na podstawie modeli
    public DbSet<Uzytkownik> Uzytkownicy { get; set; }
    public DbSet<Nauczyciel> Nauczyciele { get; set; }
    public DbSet<Uczen> Uczniowie { get; set; }
    public DbSet<Rodzic> Rodzice { get; set; }
    public DbSet<Klasa> Klasy { get; set; }
    public DbSet<Przedmiot> Przedmioty { get; set; }
    public DbSet<Semestr> Semestry { get; set; }
    public DbSet<Plan> Plany { get; set; }
    public DbSet<Zajecia> Zajecia { get; set; }
    public DbSet<Sala> Sale { get; set; }
    public DbSet<Ocena> Oceny { get; set; }
    public DbSet<Frekwencja> Frekwencje { get; set; }
    public DbSet<Zadanie> Zadania { get; set; }

    // Metoda do konfiguracji modelu danych i relacji (tzw. Fluent API)
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- Konfiguracja relacji jeden-do-wielu ---

        // Relacja: Klasa (1) -> Uczniowie (*)
        modelBuilder.Entity<Klasa>()
            .HasMany(k => k.Uczniowie)
            .WithOne(u => u.Klasa)
            .HasForeignKey(u => u.KlasaId)
            .OnDelete(DeleteBehavior.Restrict); // Nie usuwaj klasy, jeśli ma przypisanych uczniów

        // Relacja: Nauczyciel (1) -> WystawioneOceny (*)
        modelBuilder.Entity<Nauczyciel>()
            .HasMany(n => n.WystawioneOceny)
            .WithOne(o => o.Nauczyciel)
            .HasForeignKey(o => o.NauczycielId)
            .OnDelete(DeleteBehavior.Restrict); // Nie usuwaj nauczyciela, jeśli wystawił oceny

        // --- Konfiguracja relacji jeden-do-jednego ---

        // Relacja: Klasa (1) <-> Nauczyciel (1) jako Wychowawca
        modelBuilder.Entity<Klasa>()
            .HasOne(k => k.Wychowawca)
            .WithOne(n => n.Wychowawstwo)
            .HasForeignKey<Klasa>(k => k.WychowawcaId)
            .OnDelete(DeleteBehavior.Restrict); // Nie usuwaj nauczyciela, który jest wychowawcą

        // Relacja: Klasa (1) <-> Plan (1)
        modelBuilder.Entity<Klasa>()
            .HasOne(k => k.Plan)
            .WithOne(p => p.Klasa)
            .HasForeignKey<Plan>(p => p.KlasaId);

        // --- Konfiguracja relacji wiele-do-wielu ---

        // Relacja: Uczen (*) <-> Rodzic (*)
        modelBuilder.Entity<Uczen>()
            .HasMany(u => u.Rodzice)
            .WithMany(r => r.Dzieci);

        // --- Konfiguracja typów Enum ---

        // Mapowanie enumów na stringi w bazie danych dla lepszej czytelności
        modelBuilder.Entity<Ocena>()
            .Property(o => o.Typ)
            .HasConversion<string>();

        modelBuilder.Entity<Frekwencja>()
            .Property(f => f.Status)
            .HasConversion<string>();

        // --- Konfiguracja dziedziczenia ---
        // EF Core domyślnie użyje strategii TPH (Table-Per-Hierarchy) dla klasy Uzytkownik.
        // Oznacza to, że wszyscy użytkownicy (Nauczyciel, Uczen, Rodzic) będą w jednej tabeli `Uzytkownicy`
        // z dodatkową kolumną "Discriminator" określającą typ użytkownika.
        // Jawna konfiguracja nie jest tu wymagana, jeśli domyślne zachowanie jest akceptowalne.
    }
}