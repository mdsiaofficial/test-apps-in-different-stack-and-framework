using CSharpDotnet.Data;
using CSharpDotnet.DTOs;
using CSharpDotnet.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CSharpDotnet.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;
    public CategoriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Category>>> List() => await _db.Categories.AsNoTracking().ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Category>> Get(int id)
    {
        var cat = await _db.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
        if (cat is null) return NotFound(new { error = "not found" });
        return cat;
    }

    [HttpPost]
    public async Task<ActionResult<Category>> Create([FromBody] CategoryRequest req)
    {
        var cat = new Category { Name = req.Name, Description = req.Description! };
        _db.Categories.Add(cat);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = cat.Id }, cat);
    }
}