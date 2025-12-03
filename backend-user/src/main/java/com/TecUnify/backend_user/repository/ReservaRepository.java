package com.TecUnify.backend_user.repository;

import com.TecUnify.backend_user.model.Reserva;
import com.TecUnify.backend_user.model.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByUsuarioId(Long userId);

    // Para detectar si un espacio está reservado
    List<Reserva> findByEspacioIdAndEstadoIn(Long espacioId, List<EstadoReserva> estados);

    List<Reserva> findByEstado(EstadoReserva estado);

    // --------------------------------------------------------
    // 🔥 NUEVO — Update parcial: SOLO estado + fecha actualización
    // --------------------------------------------------------
    @Modifying
    @Transactional
    @Query("UPDATE Reserva r SET r.estado = :estado, r.fechaActualizacion = CURRENT_TIMESTAMP WHERE r.id = :id")
    void actualizarSoloEstado(@Param("id") Long id, @Param("estado") EstadoReserva estado);
}
