package com.example.app.controller;

import com.example.app.model.Category;
import com.example.app.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository repo;

    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    public record CategoryReq(String name, String description) {}

    @GetMapping
    public List<Category> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Integer id) {
        return repo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "not found")));
    }

    @PostMapping
    public ResponseEntity<Category> create(@RequestBody CategoryReq req) {
        Category c = new Category();
        c.setName(req.name());
        c.setDescription(req.description());
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(c));
    }
}
