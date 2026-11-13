package com.example.app.controller;

import com.example.app.model.Order;
import com.example.app.model.OrderItem;
import com.example.app.repository.OrderItemRepository;
import com.example.app.repository.OrderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepo;
    private final OrderItemRepository itemRepo;

    public OrderController(OrderRepository orderRepo, OrderItemRepository itemRepo) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
    }

    public record OrderReq(Integer userId, String status, Double total) {}

    @GetMapping
    public List<Order> list() {
        return orderRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Integer id) {
        return orderRepo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "not found")));
    }

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody OrderReq req) {
        Order o = new Order();
        o.setUserId(req.userId());
        o.setStatus(req.status());
        o.setTotal(req.total());
        o.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(orderRepo.save(o));
    }

    @GetMapping("/{id}/items")
    public List<OrderItem> items(@PathVariable Integer id) {
        return itemRepo.findByOrderId(id);
    }
}
