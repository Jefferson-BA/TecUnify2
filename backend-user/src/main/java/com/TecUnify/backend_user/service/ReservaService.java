package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.dto.ReservaDTO;
import com.TecUnify.backend_user.events.EspacioEventEmitter;
import com.TecUnify.backend_user.model.*;
import com.TecUnify.backend_user.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final UserRepository userRepository;
    private final EspacioRepository espacioRepository;

    private final EspacioEventEmitter eventEmitter;

    public List<ReservaDTO> getByUserId(Long userId) {
        return reservaRepository.findByUsuarioId(userId)
                .stream()
                .map(ReservaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ReservaDTO> getAll() {
        return reservaRepository.findAll()
                .stream()
                .map(ReservaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Reserva create(ReservaDTO dto) {

        User user = userRepository.findById(dto.getUserId()).orElse(null);
        Espacio espacio = espacioRepository.findById(dto.getEspacioId()).orElse(null);
        if (user == null || espacio == null) return null;

        Reserva r = new Reserva();
        r.setUsuario(user);
        r.setEspacio(espacio);
        r.setFechaReserva(dto.getFechaReserva());
        r.setHoraInicio(dto.getHoraInicio());
        r.setHoraFin(dto.getHoraFin());
        r.setMotivo(dto.getMotivo());
        r.setObservaciones(dto.getObservaciones());
        r.setEstado(EstadoReserva.PENDIENTE);

        if (dto.getPrecioTotal() != null) {
            r.setPrecioTotal(BigDecimal.valueOf(dto.getPrecioTotal()));
        }

        Reserva nueva = reservaRepository.save(r);

        // 🔥 Notificar reserva creada
        eventEmitter.broadcast("reserva-creada");

        // 🔥 Notificar espacio reservado
        eventEmitter.broadcast("ESPACIO_RESERVADO_" + espacio.getId());

        return nueva;
    }

    public Reserva getById(Long id) {
        return reservaRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        reservaRepository.deleteById(id);
    }

    // ❌ Cancelación por el usuario
    public void cancelarReserva(Long id) {
        Reserva r = reservaRepository.findById(id).orElse(null);
        if (r == null) return;

        r.setEstado(EstadoReserva.CANCELADA);
        reservaRepository.save(r);

        // 🔥 Notificar cancelación
        eventEmitter.broadcast("reserva-cancelada-auto");
        eventEmitter.broadcast("ESPACIO_CANCELADO_" + r.getEspacio().getId());
    }

    // 🔥 ADMIN CAMBIA ESTADO
    public Reserva updateEstado(Long id, String estado) {
        Reserva r = reservaRepository.findById(id).orElse(null);
        if (r == null) return null;

        try {
            EstadoReserva nuevo = EstadoReserva.valueOf(estado.toUpperCase());
            r.setEstado(nuevo);
        } catch (IllegalArgumentException e) {
            return null;
        }

        Reserva actualizado = reservaRepository.save(r);

        // 🔵 Si se completó → liberar espacio
        if (estado.equalsIgnoreCase("COMPLETADA")) {

            eventEmitter.broadcast("espacio-disponible");
            eventEmitter.broadcast("ESPACIO_DISPONIBLE_" + r.getEspacio().getId());

            // 🔥 Notificar al usuario
            eventEmitter.broadcast("reserva-completada");
        }

        // 🔵 Notificar cualquier otro cambio
        eventEmitter.broadcast("ESPACIO_ESTADO_" + r.getEspacio().getId());

        return actualizado;
    }
}
