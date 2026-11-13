using CSharpDotnet.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CSharpDotnet.Controllers;

[ApiController]
[Route("api/stats")]
public class StatsController : ControllerBase
{
    private readonly AppDbContext _db;
    public StatsController(AppDbContext db) => _db = db;

    [HttpGet("summary")]
    public async Task<IActionResult> Summary()
    {
        var users = await _db.Users.CountAsync();
        var products = await _db.Products.CountAsync();
        var orders = await _db.Orders.CountAsync();
        var revenue = await _db.Orders.SumAsync(o => (decimal?)o.Total) ?? 0m;
        return Ok(new { users, products, orders, revenue });
    }
}