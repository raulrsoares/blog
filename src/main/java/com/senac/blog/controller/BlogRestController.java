package com.senac.blog.controller;

import com.senac.blog.model.Publicacao;
import com.senac.blog.repository.PublicacaoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/publicacoes")
@CrossOrigin(origins = "*")
public class BlogRestController {

    @Autowired
    private PublicacaoRepository repo;

    @GetMapping
    public ResponseEntity<List<Publicacao>> listar() {
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Publicacao> buscarPorId(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Publicacao> criar(@Valid @RequestBody Publicacao p) {
        Publicacao salvo = repo.save(p);
        return ResponseEntity
                .created(URI.create("/api/publicacoes/" + salvo.getId()))
                .body(salvo);
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
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
