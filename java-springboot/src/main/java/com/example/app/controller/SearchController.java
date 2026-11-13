package com.example.app.controller;

import com.example.app.model.Product;
import com.example.app.repository.ProductRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SearchController {

    private final ProductRepository repo;

    public SearchController(ProductRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam(name = "q", required = false, defaultValue = "") String q) {
        return repo.searchByName(q);
    }
}
