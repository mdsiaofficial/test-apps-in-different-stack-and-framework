using CSharpDotnet.Data;
using CSharpDotnet.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CSharpDotnet.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    private readonly AppDbContext _db;
    public SearchController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Product>>> Search([FromQuery(Name = "q")] string? q)
    {
        q ??= string.Empty;
        var results = await _db.Products.AsNoTracking()
            .Where(p => EF.Functions.ILike(p.Name, $"%{q}%"))
            .ToListAsync();
        return results;
    }
}