using CSharpDotnet.Data;
using CSharpDotnet.DTOs;
using CSharpDotnet.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CSharpDotnet.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    public OrdersController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Order>>> List() => await _db.Orders.AsNoTracking().ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> Get(int id)
    {
        var o = await _db.Orders.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (o is null) return NotFound(new { error = "not found" });
        return o;
    }

    [HttpPost]
    public async Task<ActionResult<Order>> Create([FromBody] OrderRequest req)
    {
        var o = new Order { UserId = req.UserId, Status = req.Status, Total = req.Total, CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified) };
        _db.Orders.Add(o);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = o.Id }, o);
    }

    [HttpGet("{id:int}/items")]
    public async Task<ActionResult<List<OrderItem>>> Items(int id)
    {
        var items = await _db.OrderItems.AsNoTracking().Where(x => x.OrderId == id).ToListAsync();
        return items;
    }
}