namespace Dziennik_elektroniczny.Data;

using Dziennik_elektroniczny.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Definicja tabel w bazie danych na podstawie modeli
    public DbSet<Uzytkownik> Uzytkownicy { get; set; }
    // public DbSet<Nauczyciel> Nauczyciele { get; set; } // Usunięte
    // public DbSet<Uczen> Uczniowie { get; set; }     // Usunięte
    // public DbSet<Rodzic> Rodzice { get; set; }     // Usunięte
    public DbSet<Klasa> Klasy { get; set; }
    public DbSet<Przedmiot> Przedmioty { get; set; }
    public DbSet<Semestr> Semestry { get; set; }
    public DbSet<Plan> Plany { get; set; }
    public DbSet<Zajecia> Zajecia { get; set; }
    public DbSet<Sala> Sale { get; set; }
    public DbSet<Ocena> Oceny { get; set; }
    public DbSet<Frekwencja> Frekwencje { get; set; }
    public DbSet<Zadanie> Zadania { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- Relacje dla Uzytkownika jako UCZNIA ---

        // Relacja: Klasa (1) -> Uczniowie (*)
        modelBuilder.Entity<Uzytkownik>()
            .HasOne(u => u.Klasa) // Jako Uczeń, należy do jednej Klasy
            .WithMany(k => k.Uczniowie) // Klasa ma wielu Uczniów
            .HasForeignKey(u => u.KlasaId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false); // Nie każdy Użytkownik jest uczniem

        // Relacja: Uczeń (1) -> Oceny (*)
        modelBuilder.Entity<Uzytkownik>()
            .HasMany(u => u.Oceny) // Jako Uczeń, ma wiele Ocen
            .WithOne(o => o.Uczen) // Ocena ma jednego Ucznia
            .HasForeignKey(o => o.UczenId)
            .OnDelete(DeleteBehavior.Cascade); // Usuń oceny, gdy uczeń jest usuwany

        // Relacja: Uczeń (1) -> Frekwencje (*)
        modelBuilder.Entity<Uzytkownik>()
            .HasMany(u => u.Frekwencje) // Jako Uczeń, ma wiele wpisów frekwencji
            .WithOne(f => f.Uczen) // Frekwencja ma jednego Ucznia
            .HasForeignKey(f => f.UczenId)
            .OnDelete(DeleteBehavior.Cascade); // Usuń frekwencję, gdy uczeń jest usuwany

        // --- Relacje dla Uzytkownika jako NAUCZYCIELA ---

        // Relacja: Nauczyciel (1) -> WystawioneOceny (*)
        modelBuilder.Entity<Uzytkownik>()
            .HasMany(u => u.WystawioneOceny) // Jako Nauczyciel, wystawił wiele Ocen
            .WithOne(o => o.Nauczyciel) // Ocena ma jednego Nauczyciela
            .HasForeignKey(o => o.NauczycielId)
            .OnDelete(DeleteBehavior.Restrict); // Nie usuwaj nauczyciela, jeśli wystawił oceny

        // Relacja: Nauczyciel (1) -> UtworzoneZadania (*)
        modelBuilder.Entity<Uzytkownik>()
            .HasMany(u => u.UtworzoneZadania)
            .WithOne(z => z.Nauczyciel)
            .HasForeignKey(z => z.NauczycielId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relacja: Nauczyciel (1) -> ProwadzoneZajecia (*)
        modelBuilder.Entity<Uzytkownik>()
            .HasMany(u => u.ProwadzoneZajecia)
            .WithOne(z => z.Nauczyciel)
            .HasForeignKey(z => z.NauczycielId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relacja: Klasa (1) <-> Wychowawca (1)
        modelBuilder.Entity<Klasa>()
            .HasOne(k => k.Wychowawca) // Klasa ma jednego Wychowawcę
            .WithOne(u => u.Wychowawstwo) // Użytkownik (Nauczyciel) ma jedno Wychowawstwo
            .HasForeignKey<Klasa>(k => k.WychowawcaId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);

        // --- Relacje dla Uzytkownika jako RODZICA/UCZNIA ---

        // Relacja: Uczeń (*) <-> Rodzic (*) (Teraz Uzytkownik <-> Uzytkownik)
        modelBuilder.Entity<Uzytkownik>()
            .HasMany(u => u.Dzieci) // Użytkownik (Rodzic) ma wiele Dzieci
            .WithMany(u => u.Rodzice) // Użytkownik (Uczeń) ma wielu Rodziców
            .UsingEntity<Dictionary<string, object>>(
                "Opieka", // Nazwa tabeli łączącej w bazie danych
                j => j.HasOne<Uzytkownik>().WithMany().HasForeignKey("RodzicId").OnDelete(DeleteBehavior.Restrict),
                j => j.HasOne<Uzytkownik>().WithMany().HasForeignKey("UczenId").OnDelete(DeleteBehavior.Cascade)
            );

        // --- Pozostałe relacje ---

        // Relacja: Klasa (1) <-> Plan (1)
        modelBuilder.Entity<Klasa>()
            .HasOne(k => k.Plan)
            .WithOne(p => p.Klasa)
            .HasForeignKey<Plan>(p => p.KlasaId);

        // --- Konfiguracja typów Enum ---
        modelBuilder.Entity<Ocena>()
            .Property(o => o.Typ)
            .HasConversion<string>();

        modelBuilder.Entity<Frekwencja>()
            .Property(f => f.Status)
            .HasConversion<string>();

        // Konfiguracja dla Roli
        modelBuilder.Entity<Uzytkownik>()
            .Property(u => u.Rola)
            .HasConversion<string>();
        
        modelBuilder.Entity<Uzytkownik>(entity =>
        {
            entity.HasIndex(u => u.Email)
                .IsUnique(); 

            
        });
        modelBuilder.Entity<Uzytkownik>()
            .HasMany(u => u.Klasy)
            .WithMany();  // ← MUSI BYĆ!
        
        modelBuilder.Entity<Uzytkownik>()
            .HasMany(u => u.Przedmioty)
            .WithMany();  // ← MUSI BYĆ!
        
    }
}