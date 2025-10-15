package com.TecUnify.backend_user.repository;


import com.TecUnify.backend_user.model.Espacio;
import com.TecUnify.backend_user.model.TipoEspacio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EspacioRepository extends JpaRepository<Espacio, Long> {
    List<Espacio> findByTipo(TipoEspacio tipo);
    List<Espacio> findByDisponibleTrue();
}