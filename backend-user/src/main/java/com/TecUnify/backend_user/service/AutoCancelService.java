package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.events.ReservaEventEmitter;
import com.TecUnify.backend_user.model.EstadoReserva;
import com.TecUnify.backend_user.model.Reserva;
import com.TecUnify.backend_user.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AutoCancelService {

    private final ReservaRepository reservaRepository;
    private final ReservaEventEmitter reservaEventEmitter;

    // Ejecutar cada minuto
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void cancelarReservasVencidas() {
        LocalDate hoy = LocalDate.now();

        // Todas las reservas PENDIENTE
        List<Reserva> pendientes = reservaRepository.findByEstado(EstadoReserva.PENDIENTE);

        for (Reserva reserva : pendientes) {
            if (!reserva.getFechaReserva().isEqual(hoy)) continue;

            // Hora límite = hora_inicio + 5 minutos
            LocalDateTime limite = LocalDateTime.of(
                    reserva.getFechaReserva(),
                    reserva.getHoraInicio().plusMinutes(5)
            );

            if (LocalDateTime.now().isAfter(limite)) {
                reserva.setEstado(EstadoReserva.CANCELADA);
                String obs = "Cancelada automáticamente por inasistencia (se superó el tiempo de tolerancia).";
                reserva.setObservaciones(obs);

                reservaRepository.save(reserva);

                // 🔵 Notificar por SSE
                reservaEventEmitter.notifyAutoCancel(reserva);
            }
        }
    }
}
