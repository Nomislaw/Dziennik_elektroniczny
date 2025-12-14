using Dziennik_elektroniczny.Interfaces; // ZMIANA: Nowy using
using Dziennik_elektroniczny.Models;
using Dziennik_elektroniczny.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
// using Dziennik_elektroniczny.Data; // ZMIANA: Usunięte
// using Microsoft.EntityFrameworkCore; // ZMIANA: Usunięte
using System.Collections.Generic; // Dodane dla IEnumerable
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Dziennik_elektroniczny.DTOs.UzytkownikDto; // Dodane dla Task

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UzytkownikController : ControllerBase
    {
        // ZMIANA: z AppDbContext na IGenericRepository<Uzytkownik>
        private readonly IUzytkownikService _uzytkownikRepository;
        private readonly EmailService _emailService;
        private readonly AppDbContext _dbContext;
        public UzytkownikController(IUzytkownikService uzytkownikRepository, EmailService emailService, AppDbContext dbcontext) // ZMIANA
        {
            _uzytkownikRepository = uzytkownikRepository;
            _emailService = emailService;
            _dbContext = dbcontext;
        }
        [HttpGet("generate-hash")]
        [AllowAnonymous] // TYLKO DO TESTÓW! Usuń po użyciu!
        public ActionResult<object> GenerateHash([FromQuery] string password)
        {
            if (string.IsNullOrEmpty(password))
                return BadRequest(new ErrorResponse { Errors = new List<string> {"Podaj hasło w parametrze ?password=..."}});

            var tempUser = new Uzytkownik();
            var hasher = new PasswordHasher<Uzytkownik>();
            var hash = hasher.HashPassword(tempUser, password);

            return Ok(new
            {
                password = password,
                hash = hash,
                info = "Skopiuj wartość 'hash' do SQL"
            });
        }
        // GET: api/<UzytkownikController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Uzytkownik>>> GetAll()
        {
            // ZMIANA: Użycie repozytorium
            var uzytkownicy = await _uzytkownikRepository.GetAllAsync();
            return Ok(uzytkownicy);
        }

        // GET api/<UzytkownikController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Uzytkownik>> GetById(int id)
        {
            // ZMIANA: Użycie repozytorium
            var user = await _uzytkownikRepository.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound(new ErrorResponse { Errors = new List<string> {"Nie znaleziono użytkownika"}});
            }
            return Ok(user);
        }

        // POST api/<UzytkownikController>
        [HttpPost]
        public async Task<ActionResult<Uzytkownik>> Post([FromBody] Uzytkownik newUser, [FromQuery] string haslo) // ZMIANA: typ zwracany
        {
            newUser.UstawHaslo(haslo);
            _uzytkownikRepository.Add(newUser);
            return CreatedAtAction(nameof(GetById), new { id = newUser.Id }, newUser);
        }

        // PUT api/<UzytkownikController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Uzytkownik user)
        {
            if (id != user.Id)
            {
                return BadRequest(new ErrorResponse { Errors = new List<string> {"ID w ścieżce nie zgadza się z ID obiektu."}});
            }

            _uzytkownikRepository.Update(user, id);
            return Ok(new {message = "Pomyślnie zaktualizowano użytkownika"});
        }

        // DELETE api/<UzytkownikController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) // ZMIANA: typ zwracany
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Nieprawidłowy token JWT.");

            int currentUserId = int.Parse(userIdClaim);

            // 3. Nie pozwól usuwać samego siebie
            if (currentUserId == id)
            {
                return BadRequest(new ErrorResponse
                {
                    Errors = new List<string> { "Nie możesz usunąć swojego własnego konta." }
                });
            }
            _uzytkownikRepository.Delete(id);
            return Ok(new {message = "Usunięto użytkownika."});
        }
        [Authorize]
        [HttpPatch("password")]
        public async Task<IActionResult> ZmienHaslo([FromQuery] string stareHaslo, [FromQuery] string noweHaslo)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new ErrorResponse { Errors = new List<string> {"Nieprawidłowy token JWT."}});

            int userId = int.Parse(userIdClaim);
            var (success, message) = await _uzytkownikRepository.ZmienHasloAsync(userId, stareHaslo, noweHaslo);
            if (!success)
                return BadRequest(message);

            return Ok(new {message = "Hasło zostało zmienione."});
        }

        //PATCH: api/uzytkownik/{id}/dane?imie=Jan&nazwisko=Nowak
        [Authorize]
        [HttpPatch("data")]
        public async Task<IActionResult> ZmienDane([FromQuery] string? imie, [FromQuery] string? nazwisko)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Nieprawidłowy token JWT.");

            int userId = int.Parse(userIdClaim);

            var (success, message) = await _uzytkownikRepository.ZmienDaneAsync(userId, imie, nazwisko);
            if (!success)
                return BadRequest(new ErrorResponse { Errors = new List<string> {message}});

            return Ok(new {message = "Dane użytkownika zostały zaktualizowane."});
        }
        [Authorize]
        [HttpPatch("email")]
        public async Task<IActionResult> ZmienEmail([FromQuery] string nowyEmail)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Nieprawidłowy token JWT.");

            int userId = int.Parse(userIdClaim);

            var (success, message) = await _uzytkownikRepository.ZmienEmailAsync(userId, nowyEmail);
            if (!success) return BadRequest(message);

            return Ok(new {message = "Email użytkownika został zaktualizowany."});
        }

        [HttpPost("{id}/link-aktywacyjny")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Uzytkownik>> WyslijTokenWeryfikacyjny(int id)
        {
            var user = await _dbContext.Uzytkownicy.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return null;
            if (user.CzyEmailPotwierdzony) return BadRequest("Użytkownik już zweryfikował e-mail");

            user.TokenWeryfikacyjny = Guid.NewGuid().ToString();
            await _dbContext.SaveChangesAsync();

            var verifyUrl = $"http://localhost:3000/verify?token={user.TokenWeryfikacyjny}";
            var body = $@"
            <h3>Witaj {user.Imie}!</h3>
            <p>Dziękujemy za rejestrację w systemie Dziennik Elektroniczny.</p>
            <p>Kliknij w poniższy link, aby potwierdzić swój adres e-mail:</p>
            <a href='{verifyUrl}'>Potwierdź adres e-mail</a>";
            await _emailService.SendEmailAsync(user.Email, "Weryfikacja konta", body);

            return Ok(new { message = "Token weryfikacyjny został pomyślnie wysłany." });
        }
        
        [HttpPut("{id}/aktywuj-profil")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Uzytkownik>> AktywujProfil(int id)
        {
            var user = await _dbContext.Uzytkownicy.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return null;
            if (user.CzyEmailPotwierdzony) return BadRequest(new ErrorResponse { Errors = new List<string> { "Użytkownik już jest aktywny" } });
            
            user.TokenWeryfikacyjny = null;
            user.CzyEmailPotwierdzony = true;
            
            await _dbContext.SaveChangesAsync();
            
            return Ok(user);
        }
        
        [HttpPost("{id}/rola")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> ZmienRole(int id, [FromQuery] Rola nowaRola)
        {
            //Sprawdzamy czy administrator nie probuje zmienic swojej wlasnej roli
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userIdClaim) && int.Parse(userIdClaim) == id)
            {
                return BadRequest(new ErrorResponse { Errors = new List<string> {"Nie możesz zmienić swojej własnej roli"}});
            }
            var (success, message) = await _uzytkownikRepository.ZmienRoleAsync(id, nowaRola);
            if (!success)
            {
                return BadRequest(new ErrorResponse { Errors = new List<string> {message}});
            }
            return Ok(new {message = $"Rola użytkownika została zmieniona na {nowaRola}."});
        }
        // POST api/uzytkownik/uczen
        [HttpPost("uczen")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Uzytkownik>> DodajUcznia([FromBody] DodajUczenDto dto)
        {
            var nowyUzytkownik = new Uzytkownik
            {
                Imie = dto.Imie,
                Nazwisko = dto.Nazwisko,
                Email = dto.Email,
                Rola = Rola.Uczen,
                KlasaId = dto.KlasaId
            };

            nowyUzytkownik.UstawHaslo(dto.Haslo);

            // Jeśli podano rodziców, przypisz ich
            if (dto.RodziceIds != null && dto.RodziceIds.Any())
            {
                var rodzice = await _dbContext.Uzytkownicy
                    .Where(u => dto.RodziceIds.Contains(u.Id) && u.Rola == Rola.Rodzic)
                    .ToListAsync();
                nowyUzytkownik.Rodzice = rodzice;
            }

            await _uzytkownikRepository.Add(nowyUzytkownik);

            return Ok(new
            {
                id = nowyUzytkownik.Id,
                imie = nowyUzytkownik.Imie,
                nazwisko = nowyUzytkownik.Nazwisko,
                email = nowyUzytkownik.Email,
                rola = nowyUzytkownik.Rola.ToString(),
                klasaId = nowyUzytkownik.KlasaId
            });
        }

        // POST api/uzytkownik/nauczyciel
        [HttpPost("nauczyciel")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Uzytkownik>> DodajNauczyciela([FromBody] DodajNauczycielaDto dto)
        {
            var nowyUzytkownik = new Uzytkownik
            {
                Imie = dto.Imie,
                Nazwisko = dto.Nazwisko,
                Email = dto.Email,
                Rola = Rola.Nauczyciel
            };

            nowyUzytkownik.UstawHaslo(dto.Haslo);

            // Jeśli nauczyciel ma być wychowawcą, sprawdź czy klasa istnieje
            if (dto.WychowawstwoKlasaId.HasValue)
            {
                var klasa = await _dbContext.Klasy.FindAsync(dto.WychowawstwoKlasaId.Value);
                if (klasa == null)
                    return BadRequest(new ErrorResponse { Errors = new List<string> {"Podana klasa nie istnieje."}});

                // Sprawdź czy klasa nie ma już wychowawcy
                var istniejacyWychowawca = await _dbContext.Uzytkownicy
                    .AnyAsync(u => u.Wychowawstwo.Id == dto.WychowawstwoKlasaId.Value);
                if (istniejacyWychowawca)
                    return BadRequest(new ErrorResponse { Errors = new List<string> {"Ta klasa ma już przypisanego wychowawcę."}});

                nowyUzytkownik.Wychowawstwo = klasa;
            }

            await _uzytkownikRepository.Add(nowyUzytkownik);
            return Ok(new
            {
                id = nowyUzytkownik.Id,
                imie = nowyUzytkownik.Imie,
                nazwisko = nowyUzytkownik.Nazwisko,
                email = nowyUzytkownik.Email,
                rola = nowyUzytkownik.Rola.ToString(),
                wychowawstwoKlasaId = dto.WychowawstwoKlasaId
            });
        }

        // POST api/uzytkownik/rodzic
        [HttpPost("rodzic")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Uzytkownik>> DodajRodzica([FromBody] DodajRodzicaDto dto)
        {
            if (dto.DzieciIds == null || !dto.DzieciIds.Any())
                return BadRequest("Rodzic musi mieć przypisane co najmniej jedno dziecko.");

            var nowyUzytkownik = new Uzytkownik
            {
                Imie = dto.Imie,
                Nazwisko = dto.Nazwisko,
                Email = dto.Email,
                Rola = Rola.Rodzic
            };

            nowyUzytkownik.UstawHaslo(dto.Haslo);

            // Pobierz dzieci (tylko uczniów)
            var dzieci = await _dbContext.Uzytkownicy
                .Where(u => dto.DzieciIds.Contains(u.Id) && u.Rola == Rola.Uczen)
                .ToListAsync();

            if (dzieci.Count != dto.DzieciIds.Count)
                return BadRequest(new ErrorResponse { Errors = new List<string> {"Niektóre z podanych ID nie należą do uczniów."}});

            nowyUzytkownik.Dzieci = dzieci;

            await _uzytkownikRepository.Add(nowyUzytkownik);
            return Ok(new
            {
                id = nowyUzytkownik.Id,
                imie = nowyUzytkownik.Imie,
                nazwisko = nowyUzytkownik.Nazwisko,
                email = nowyUzytkownik.Email,
                rola = "Rodzic",
                liczbaDzieci = dzieci.Count
            });
        }
        // GET: api/uzytkownik/uczniowie
        [HttpGet("uczniowie")]
        [Authorize(Roles = "Administrator, Nauczyciel")]
        public async Task<ActionResult<IEnumerable<UczenDto>>> GetUczniowie()
        {
            var uczniowie = await _dbContext.Uzytkownicy
                .Where(u => u.Rola == Rola.Uczen)
                .Include(u => u.Klasa)
                .Include(u => u.Rodzice)
                .Select(u => new UczenDto
                {
                    Id = u.Id,
                    Imie = u.Imie,
                    Nazwisko = u.Nazwisko,
                    Email = u.Email,
                    Rola = u.Rola.ToString(),
                    KlasaNazwa = u.Klasa.Nazwa,
                    KlasaId = u.KlasaId,
                    CzyEmailPotwierdzony = u.CzyEmailPotwierdzony,
                    Rodzice = u.Rodzice.Select(r => new RodzicSimpleDto
                    {
                        Id = r.Id,
                        Imie = r.Imie,
                        Nazwisko = r.Nazwisko
                    }).ToList()
                })
                .ToListAsync();

            return Ok(uczniowie);
        }

        // GET: api/uzytkownik/nauczyciele
        [HttpGet("nauczyciele")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<IEnumerable<NauczycielDto>>> GetNauczyciele()
        {
            var nauczyciele = await _dbContext.Uzytkownicy
                .Where(u => u.Rola == Rola.Nauczyciel)
                .Include(u => u.Wychowawstwo)
                .Select(u => new NauczycielDto
                {
                    Id = u.Id,
                    Imie = u.Imie,
                    Nazwisko = u.Nazwisko,
                    Email = u.Email,
                    Rola = u.Rola.ToString(),
                    CzyEmailPotwierdzony = u.CzyEmailPotwierdzony,
                    CzyWychowawca = u.Wychowawstwo != null,
                    WychowawstwoKlasaNazwa = u.Wychowawstwo != null ? u.Wychowawstwo.Nazwa : null
                })
                .ToListAsync();

            return Ok(nauczyciele);
        }

        // GET: api/uzytkownik/rodzice
        [HttpGet("rodzice")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<IEnumerable<RodzicDto>>> GetRodzice()
        {
            var rodzice = await _dbContext.Uzytkownicy
                .Where(u => u.Rola == Rola.Rodzic)
                .Include(u => u.Dzieci)
                    .ThenInclude(d => d.Klasa)
                .Select(u => new RodzicDto
                {
                    Id = u.Id,
                    Imie = u.Imie,
                    Nazwisko = u.Nazwisko,
                    Email = u.Email,
                    Rola = u.Rola.ToString(),
                    CzyEmailPotwierdzony = u.CzyEmailPotwierdzony,
                    Dzieci = u.Dzieci.Select(d => new UczenSimpleDto
                    {
                        Id = d.Id,
                        Imie = d.Imie,
                        Nazwisko = d.Nazwisko,
                        KlasaNazwa = d.Klasa.Nazwa
                    }).ToList()
                })
                .ToListAsync();

            return Ok(rodzice);
        }
        // GET: api/uzytkownik/uczen/{id}
        [HttpGet("uczen/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<UczenDto>> GetUczenById(int id)
        {
            var uczen = await _dbContext.Uzytkownicy
                .Where(u => u.Id == id && u.Rola == Rola.Uczen)
                .Include(u => u.Klasa)
                .Include(u => u.Rodzice)
                .Include(u => u.Oceny)
                    .ThenInclude(o => o.Przedmiot)
                .Include(u => u.Frekwencje)
                .Select(u => new UczenDto
                {
                    Id = u.Id,
                    Imie = u.Imie,
                    Nazwisko = u.Nazwisko,
                    Email = u.Email,
                    KlasaId = u.KlasaId,
                    KlasaNazwa = u.Klasa != null ? u.Klasa.Nazwa : null,
                    CzyEmailPotwierdzony = u.CzyEmailPotwierdzony,
                    Rodzice = u.Rodzice.Select(r => new RodzicSimpleDto
                    {
                        Id = r.Id,
                        Imie = r.Imie,
                        Nazwisko = r.Nazwisko,
                        Email = r.Email
                    }).ToList(),
                    LiczbaOcen = u.Oceny.Count,
                    SredniaOcen = u.Oceny.Any() ? u.Oceny.Average(o => (double)o.Wartosc) : 0
                })
                .FirstOrDefaultAsync();

            if (uczen == null)
                return NotFound("Uczeń o podanym ID nie został znaleziony.");

            return Ok(uczen);
        }

        // GET: api/uzytkownik/nauczyciel/{id}
        [HttpGet("nauczyciel/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<NauczycielDto>> GetNauczycielById(int id)
        {
            var nauczyciel = await _dbContext.Uzytkownicy
                .Where(u => u.Id == id && u.Rola == Rola.Nauczyciel)
                .Include(u => u.Wychowawstwo)
                .Include(u => u.ProwadzoneZajecia)
                    .ThenInclude(z => z.Przedmiot)
                .Include(u => u.WystawioneOceny)
                .Select(u => new NauczycielDto
                {
                    Id = u.Id,
                    Imie = u.Imie,
                    Nazwisko = u.Nazwisko,
                    Email = u.Email,
                    CzyEmailPotwierdzony = u.CzyEmailPotwierdzony,
                    CzyWychowawca = u.Wychowawstwo != null,
                    WychowawstwoKlasaId = u.Wychowawstwo != null ? u.Wychowawstwo.Id : null,
                    WychowawstwoKlasaNazwa = u.Wychowawstwo != null ? u.Wychowawstwo.Nazwa : null,
                    ProwadzonePrzedmioty = u.ProwadzoneZajecia
                        .Select(z => z.Przedmiot.Nazwa)
                        .Distinct()
                        .ToList(),
                    LiczbaWystawionychOcen = u.WystawioneOceny.Count
                })
                .FirstOrDefaultAsync();

            if (nauczyciel == null)
                return NotFound("Nauczyciel o podanym ID nie został znaleziony.");

            return Ok(nauczyciel);
        }

        // GET: api/uzytkownik/rodzic/{id}
        [HttpGet("rodzic/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<RodzicDto>> GetRodzicById(int id)
        {
            var rodzic = await _dbContext.Uzytkownicy
                .Where(u => u.Id == id && u.Rola == Rola.Rodzic)
                .Include(u => u.Dzieci)
                    .ThenInclude(d => d.Klasa)
                .Select(u => new RodzicDto
                {
                    Id = u.Id,
                    Imie = u.Imie,
                    Nazwisko = u.Nazwisko,
                    Email = u.Email,
                    CzyEmailPotwierdzony = u.CzyEmailPotwierdzony,
                    Dzieci = u.Dzieci.Select(d => new UczenSimpleDto
                    {
                        Id = d.Id,
                        Imie = d.Imie,
                        Nazwisko = d.Nazwisko,
                        Email = d.Email,
                        KlasaNazwa = d.Klasa != null ? d.Klasa.Nazwa : null,
                        KlasaId = d.KlasaId
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (rodzic == null)
                return NotFound("Rodzic o podanym ID nie został znaleziony.");

            return Ok(rodzic);
        }
        // GET: api/uzytkownik/szczegoly/{id}
        [HttpGet("szczegoly/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<object>> GetSzczegolyById(int id)
        {
            var uzytkownik = await _dbContext.Uzytkownicy
                .Where(u => u.Id == id)
                .Select(u => new { u.Id, u.Rola })
                .FirstOrDefaultAsync();

            if (uzytkownik == null)
                return NotFound("Użytkownik o podanym ID nie został znaleziony.");

            return uzytkownik.Rola switch
            {
                Rola.Uczen => await GetUczenById(id),
                Rola.Nauczyciel => await GetNauczycielById(id),
                Rola.Rodzic => await GetRodzicById(id),
                //Rola.Administrator => await GetAdministratorById(id),
                _ => BadRequest("Nieznana rola użytkownika.")
            };
        }

        // PUT: api/uzytkownik/uczen/{id}
        [HttpPut("uczen/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> EdytujUcznia(int id, [FromBody] EdytujUcznia dto)
        {
            var uczen = await _dbContext.Uzytkownicy
                .Include(u => u.Rodzice)
                .FirstOrDefaultAsync(u => u.Id == id && u.Rola == Rola.Uczen);

            if (uczen == null)
                return NotFound("Uczeń o podanym ID nie został znaleziony.");

            // Sprawdź czy klasa istnieje
            var klasaIstnieje = await _dbContext.Klasy.AnyAsync(k => k.Id == dto.KlasaId);
            if (!klasaIstnieje)
                return BadRequest("Podana klasa nie istnieje.");

            // Aktualizuj podstawowe dane
            uczen.Imie = dto.Imie;
            uczen.Nazwisko = dto.Nazwisko;
            uczen.Email = dto.Email;
            uczen.KlasaId = dto.KlasaId;

            // Aktualizuj rodziców jeśli podano
            if (dto.RodziceIds != null)
            {
                uczen.Rodzice.Clear();
                var rodzice = await _dbContext.Uzytkownicy
                    .Where(u => dto.RodziceIds.Contains(u.Id) && u.Rola == Rola.Rodzic)
                    .ToListAsync();

                foreach (var rodzic in rodzice)
                {
                    uczen.Rodzice.Add(rodzic);
                }
            }

            await _dbContext.SaveChangesAsync();
            return Ok(new {message = "Edytowano ucznia"});
        }

        // PUT: api/uzytkownik/nauczyciel/{id}
        [HttpPut("nauczyciel/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> EdytujNauczyciela(int id, [FromBody] EdytujNauczyciela dto)
        {
            var nauczyciel = await _dbContext.Uzytkownicy
                .Include(u => u.Wychowawstwo)
                .FirstOrDefaultAsync(u => u.Id == id && u.Rola == Rola.Nauczyciel);

            if (nauczyciel == null)
                return NotFound("Nauczyciel o podanym ID nie został znaleziony.");

            // Aktualizuj podstawowe dane
            nauczyciel.Imie = dto.Imie;
            nauczyciel.Nazwisko = dto.Nazwisko;
            nauczyciel.Email = dto.Email;

            // Aktualizuj wychowawstwo jeśli podano
            if (dto.WychowawstwoKlasaId.HasValue)
            {
                var klasa = await _dbContext.Klasy.FindAsync(dto.WychowawstwoKlasaId.Value);
                if (klasa == null)
                    return BadRequest("Podana klasa nie istnieje.");

                // Sprawdź czy klasa nie ma już innego wychowawcy
                var innyWychowawca = await _dbContext.Uzytkownicy
                    .AnyAsync(u => u.Wychowawstwo.Id == dto.WychowawstwoKlasaId.Value && u.Id != id);

                if (innyWychowawca)
                    return BadRequest("Ta klasa ma już przypisanego innego wychowawcę.");

                nauczyciel.Wychowawstwo = klasa;
            }
            else
            {
                nauczyciel.Wychowawstwo = null;
            }

            await _dbContext.SaveChangesAsync();
            return Ok(new {message = "Edytowano nauczyciela"});
        }

        // PUT: api/uzytkownik/rodzic/{id}
        [HttpPut("rodzic/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> EdytujRodzica(int id, [FromBody] EdytujRodzica dto)
        {
            var rodzic = await _dbContext.Uzytkownicy
                .Include(u => u.Dzieci)
                .FirstOrDefaultAsync(u => u.Id == id && u.Rola == Rola.Rodzic);

            if (rodzic == null)
                return NotFound("Rodzic o podanym ID nie został znaleziony.");

            if (dto.DzieciIds == null || !dto.DzieciIds.Any())
                return BadRequest("Rodzic musi mieć przypisane co najmniej jedno dziecko.");

            // Aktualizuj podstawowe dane
            rodzic.Imie = dto.Imie;
            rodzic.Nazwisko = dto.Nazwisko;
            rodzic.Email = dto.Email;

            // Aktualizuj dzieci
            rodzic.Dzieci.Clear();
            var dzieci = await _dbContext.Uzytkownicy
                .Where(u => dto.DzieciIds.Contains(u.Id) && u.Rola == Rola.Uczen)
                .ToListAsync();

            if (dzieci.Count != dto.DzieciIds.Count)
                return BadRequest("Niektóre z podanych ID nie należą do uczniów.");

            foreach (var dziecko in dzieci)
            {
                rodzic.Dzieci.Add(dziecko);
            }

            await _dbContext.SaveChangesAsync();
            return Ok(new {message = "Edytowano rodzica"});
        }

         //PUT: api/uzytkownik/administrator/{id}
        [HttpPut("administrator/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> EdytujAdministratora(int id, [FromBody] EdytujAdministratora dto)
        {
            var admin = await _dbContext.Uzytkownicy
                .FirstOrDefaultAsync(u => u.Id == id && u.Rola == Rola.Administrator);

            if (admin == null)
                return NotFound("Administrator o podanym ID nie został znaleziony.");

            // Aktualizuj podstawowe dane
            admin.Imie = dto.Imie;
            admin.Nazwisko = dto.Nazwisko;
            admin.Email = dto.Email;

            await _dbContext.SaveChangesAsync();
            return Ok(new {message = "Edytowano administratora"});
        }

         //GET: api/uzytkownik/administrator/{id}
        [HttpGet("administrator/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<AdministratorDto>> GetAdministratorById(int id)
        {
            var administrator = await _dbContext.Uzytkownicy
                .Where(u => u.Id == id && u.Rola == Rola.Administrator)
                .Select(u => new AdministratorDto
                {
                    Id = u.Id,
                    Imie = u.Imie,
                    Nazwisko = u.Nazwisko,
                    Email = u.Email,
                    CzyEmailPotwierdzony = u.CzyEmailPotwierdzony
                })
                .FirstOrDefaultAsync();

            if (administrator == null)
                return NotFound("Administrator o podanym ID nie został znaleziony.");

            return Ok(administrator);
        }

        // GET: api/uzytkownik/administratorzy
        [HttpGet("administratorzy")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<IEnumerable<AdministratorDto>>> GetAdministratorzy()
        {
            var administratorzy = await _dbContext.Uzytkownicy
                .Where(u => u.Rola == Rola.Administrator)
                .Select(u => new AdministratorDto
                {
                    Id = u.Id,
                    Imie = u.Imie,
                    Nazwisko = u.Nazwisko,
                    Email = u.Email,
                    CzyEmailPotwierdzony = u.CzyEmailPotwierdzony
                })
                .ToListAsync();

            return Ok(administratorzy);
        }
         //POST api/uzytkownik/administrator
        [HttpPost("administrator")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Uzytkownik>> DodajAdministratora([FromBody] DodajAdministratoraDto dto)
        {
            var nowyUzytkownik = new Uzytkownik
            {
                Imie = dto.Imie,
                Nazwisko = dto.Nazwisko,
                Email = dto.Email,
                Rola = Rola.Administrator
            };

            nowyUzytkownik.UstawHaslo(dto.Haslo);

            _uzytkownikRepository.Add(nowyUzytkownik);
            return CreatedAtAction(nameof(GetById), new { id = nowyUzytkownik.Id }, nowyUzytkownik);
        }
        // DELETE: api/uzytkownik/administrator/{id}
        [HttpDelete("administrator/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> UsunAdministratora(int id)
        {
            // 1. Pobierz użytkownika z repozytorium
            var admin = await _uzytkownikRepository.GetByIdAsync(id);
            if (admin == null || admin.Rola != Rola.Administrator)
            {
                return NotFound(new ErrorResponse
                {
                    Errors = new List<string> { "Administrator o podanym ID nie został znaleziony." }
                });
            }


            // 2. Pobierz ID aktualnie zalogowanego admina
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Nieprawidłowy token JWT.");

            int currentAdminId = int.Parse(userIdClaim);

            // 3. Nie pozwól usuwać samego siebie
            if (currentAdminId == admin.Id)
            {
                return BadRequest(new ErrorResponse
                {
                    Errors = new List<string> { "Nie możesz usunąć swojego własnego konta administratora." }
                });
            }

            // 4. Usuń przez repozytorium
            _uzytkownikRepository.Delete(id);

            return Ok(new { message = "Administrator został pomyślnie usunięty." });
        }
        


    }

}