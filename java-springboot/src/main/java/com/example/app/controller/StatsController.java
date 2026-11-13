package com.example.app.controller;

import com.example.app.repository.OrderRepository;
import com.example.app.repository.ProductRepository;
import com.example.app.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;

    public StatsController(UserRepository userRepo, ProductRepository productRepo, OrderRepository orderRepo) {
        this.userRepo = userRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        Double revenue = orderRepo.sumTotal();
        return Map.of(
                "users", userRepo.count(),
                "products", productRepo.count(),
                "orders", orderRepo.count(),
                "revenue", revenue == null ? 0.0 : revenue
        );
    }
}
