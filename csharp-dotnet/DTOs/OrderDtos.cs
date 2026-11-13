namespace CSharpDotnet.DTOs;

public class OrderRequest
{
    public int? UserId { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Total { get; set; }
}