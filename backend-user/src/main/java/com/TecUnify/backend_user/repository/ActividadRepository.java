package com.TecUnify.backend_user.repository;

import com.TecUnify.backend_user.model.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActividadRepository extends JpaRepository<Actividad, Long> {

    List<Actividad> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
}
