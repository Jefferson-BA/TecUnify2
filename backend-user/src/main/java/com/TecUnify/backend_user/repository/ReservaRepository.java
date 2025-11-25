package com.TecUnify.backend_user.repository;

import com.TecUnify.backend_user.model.Reserva;
import com.TecUnify.backend_user.model.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByUsuarioId(Long userId);

    // 🔥 NECESARIO → saber si el espacio está reservado/ocupado
    List<Reserva> findByEspacioIdAndEstadoIn(Long espacioId, List<EstadoReserva> estados);
    List<Reserva> findByEstado(EstadoReserva estado);

}
