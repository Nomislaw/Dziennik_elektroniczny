using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UzytkownikController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        public UzytkownikController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        // GET: api/<UzytkownikController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Uzytkownik>>> GetAll()
        {
            return await _appDbContext.Uzytkownicy.ToListAsync();
        }

        // GET api/<UzytkownikController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Uzytkownik>> GetById(int id)
        {
           var user = await _appDbContext.Uzytkownicy.FindAsync(id);

            if(user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST api/<UzytkownikController>
        [HttpPost]
        public async void Post([FromBody] Uzytkownik newUser)
        {
            _appDbContext.Uzytkownicy.AddAsync(newUser);
            await _appDbContext.SaveChangesAsync();
        }

        // PUT api/<UzytkownikController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Uzytkownik user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _appDbContext.Entry(user).State = EntityState.Modified;

            try
            {
                await _appDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_appDbContext.Uzytkownicy.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE api/<UzytkownikController>/5
        [HttpDelete("{id}")]
        public async void Delete(int id)
        {
            var user = await _appDbContext.Uzytkownicy.FindAsync(id);
            if(user != null)
            {
                _appDbContext.Uzytkownicy.Remove(user);
                await _appDbContext.SaveChangesAsync();
            }
        }
    }
}
