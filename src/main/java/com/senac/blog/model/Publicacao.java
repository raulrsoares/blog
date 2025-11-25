package com.senac.blog.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
public class Publicacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título é obrigatório")
    @Size(min = 5, max = 100, message = "Título deve ter entre 5 e 100 caracteres")
    private String titulo;

    @NotBlank(message = "O autor é obrigatório")
    private String autor;

    @NotNull(message = "A data é obrigatória")
    private LocalDate dataPublicacao;

    @NotBlank(message = "O texto é obrigatório")
    @Size(min = 10, message = "Texto precisa ter pelo menos 10 caracteres")
    @Column(length = 5000)
    private String texto;

    // getters e setters (deixa o IntelliJ gerar pra ti: Alt + Insert → Getter and Setter → seleciona todos)

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public LocalDate getDataPublicacao() { return dataPublicacao; }
    public void setDataPublicacao(LocalDate dataPublicacao) { this.dataPublicacao = dataPublicacao; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    // pra saber se já foi publicado ou não
    public boolean isPublicado() {
        return dataPublicacao.isBefore(LocalDate.now().plusDays(1));
    }
}
