package com.TecUnify.backend_user.repository;

import com.TecUnify.backend_user.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByUsuarioId(Long userId);

    // NUEVO: Buscar si hay conflicto de horario (excluyendo la reserva actual)
    @Query("SELECT COUNT(r) > 0 FROM Reserva r " +
            "WHERE r.espacio.id = :espacioId " +
            "AND r.fechaReserva = :fecha " +
            "AND r.id <> :reservaId " + // No contarse a sí misma
            "AND r.estado IN ('PENDIENTE', 'CONFIRMADA') " + // Solo activas
            "AND (:horaInicio < r.horaFin AND :horaFin > r.horaInicio)") // Lógica de superposición
    boolean existsConflict(@Param("espacioId") Long espacioId,
            @Param("reservaId") Long reservaId,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin);
}