package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.dto.ReservaAdminDTO;
import com.TecUnify.backend_user.dto.ReservaDTO;
import com.TecUnify.backend_user.events.EspacioEventEmitter;
import com.TecUnify.backend_user.model.*;
import com.TecUnify.backend_user.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final UserRepository userRepository;
    private final EspacioRepository espacioRepository;

    private final EspacioEventEmitter eventEmitter;

    // -------------------------
    // RESERVAS DEL USUARIO
    // -------------------------
    public List<ReservaDTO> getByUserId(Long userId) {
        return reservaRepository.findByUsuarioId(userId)
                .stream()
                .map(ReservaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // -------------------------
    // TODAS LAS RESERVAS
    // -------------------------
    public List<ReservaDTO> getAll() {
        return reservaRepository.findAll()
                .stream()
                .map(ReservaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // -------------------------
    // CREAR RESERVA
    // -------------------------
    public Reserva create(ReservaDTO dto) {

        User user = userRepository.findById(dto.getUserId()).orElse(null);
        Espacio espacio = espacioRepository.findById(dto.getEspacioId()).orElse(null);
        if (user == null || espacio == null) return null;

        Reserva r = new Reserva();
        r.setUsuario(user);
        r.setEspacio(espacio);

        r.setFechaReserva(LocalDate.parse(dto.getFechaReserva()));
        r.setHoraInicio(LocalTime.parse(dto.getHoraInicio()));
        r.setHoraFin(LocalTime.parse(dto.getHoraFin()));

        r.setMotivo(dto.getMotivo());
        r.setObservaciones(dto.getObservaciones());
        r.setEstado(EstadoReserva.PENDIENTE);

        if (dto.getPrecioTotal() != null)
            r.setPrecioTotal(BigDecimal.valueOf(dto.getPrecioTotal()));

        Reserva nueva = reservaRepository.save(r);

        // SSE EVENTOS
        eventEmitter.broadcast("reserva-creada");
        eventEmitter.broadcast("ESPACIO_RESERVADO_" + espacio.getId());

        return nueva;
    }

    public Reserva getById(Long id) {
        return reservaRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        reservaRepository.deleteById(id);
    }

    // --------------------------------------------------------
    // 🔥 FIX TOTAL — ADMIN cambia estado sin violar CHECK
    // --------------------------------------------------------
    public ReservaDTO updateEstado(Long id, String estado) {

        Reserva r = reservaRepository.findById(id).orElse(null);
        if (r == null) return null;

        EstadoReserva nuevoEstado;
        try {
            nuevoEstado = EstadoReserva.valueOf(estado.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }

        // 🔥 UPDATE parcial, NO toca fecha_reserva ni hora_inicio/fin
        reservaRepository.actualizarSoloEstado(id, nuevoEstado);

        // Recargar desde BD para devolver DTO correcto
        Reserva actualizado = reservaRepository.findById(id).orElse(null);

        // SSE
        if (estado.equalsIgnoreCase("COMPLETADA")) {
            eventEmitter.broadcast("espacio-disponible");
            eventEmitter.broadcast("ESPACIO_DISPONIBLE_" + r.getEspacio().getId());
            eventEmitter.broadcast("reserva-completada");
        }

        eventEmitter.broadcast("ESPACIO_ESTADO_" + r.getEspacio().getId());

        return ReservaDTO.fromEntity(actualizado);
    }
    public List<ReservaAdminDTO> getAllAdmin() {
        return reservaRepository.findAll().stream().map(r ->
                new ReservaAdminDTO(
                        r.getId(),

                        r.getUsuario().getId(),
                        r.getUsuario().getFirstName() + " " + r.getUsuario().getLastName(),

                        r.getEspacio().getId(),
                        r.getEspacio().getNombre(),

                        r.getFechaReserva().toString(),
                        r.getHoraInicio().toString(),
                        r.getHoraFin().toString(),

                        r.getMotivo(),
                        r.getEstado().name()
                )
        ).collect(Collectors.toList());
    }

}
