package com.senac.blog.controller;

import com.senac.blog.model.Publicacao;
import com.senac.blog.repository.PublicacaoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publicacoes")
@CrossOrigin(origins = "*")
public class BlogRestController {

    @Autowired
    private PublicacaoRepository repo;

    @GetMapping
    public List<Publicacao> listar() {
        return repo.findAll();
    }

    @PostMapping
    public Publicacao criar(@Valid @RequestBody Publicacao p) {
        return repo.save(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Publicacao> atualizar(@PathVariable Long id, @Valid @RequestBody Publicacao p) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        p.setId(id);
        return ResponseEntity.ok(repo.save(p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}