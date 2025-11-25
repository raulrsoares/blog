package com.senac.blog.repository;

import com.senac.blog.model.Publicacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublicacaoRepository extends JpaRepository<Publicacao, Long> {

}
