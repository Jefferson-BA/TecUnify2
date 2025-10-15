package com.TecUnify.backend_user.repository;

import com.TecUnify.backend_user.model.Reserva;
import com.TecUnify.backend_user.model.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByUsuarioId(Long usuarioId);
    List<Reserva> findByEspacioId(Long espacioId);
    List<Reserva> findByEstado(EstadoReserva estado);

    @Query("SELECT r FROM Reserva r WHERE r.espacio.id = ?1 AND r.estado != 'CANCELADA'")
    List<Reserva> findActivosByEspacio(Long espacioId);

    @Query("SELECT r FROM Reserva r WHERE r.espacio.id = ?1 " +
            "AND ((r.fechaInicio <= ?3 AND r.fechaFin >= ?2) OR " +
            "(r.fechaInicio >= ?2 AND r.fechaInicio < ?3)) " +
            "AND r.estado != 'CANCELADA'")
    List<Reserva> findConflictingReservas(Long espacioId, LocalDateTime inicio, LocalDateTime fin);
}