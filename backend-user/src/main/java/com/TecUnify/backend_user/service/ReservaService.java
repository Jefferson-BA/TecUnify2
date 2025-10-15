package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.dto.ReservaDTO;
import com.TecUnify.backend_user.model.Reserva;
import com.TecUnify.backend_user.model.User;
import com.TecUnify.backend_user.model.Espacio;
import com.TecUnify.backend_user.repository.ReservaRepository;
import com.TecUnify.backend_user.repository.UserRepository;
import com.TecUnify.backend_user.repository.EspacioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaService {
    private final ReservaRepository reservaRepository;
    private final UserRepository userRepository;
    private final EspacioRepository espacioRepository;
    private final UserService userService;
    private final EspacioService espacioService;

    public List<ReservaDTO> getReservasByUsuario(Long usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ReservaDTO> getReservasByEspacio(Long espacioId) {
        return reservaRepository.findByEspacioId(espacioId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ReservaDTO getReservaById(Long id) {
        return reservaRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    }

    public ReservaDTO createReserva(Reserva reserva) {
        User usuario = userRepository.findById(reserva.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Espacio espacio = espacioRepository.findById(reserva.getEspacio().getId())
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado"));

        // Verificar disponibilidad
        List<Reserva> conflictos = reservaRepository.findConflictingReservas(
                espacio.getId(),
                reserva.getFechaInicio(),
                reserva.getFechaFin()
        );

        if (!conflictos.isEmpty()) {
            throw new RuntimeException("El espacio no está disponible en ese horario");
        }

        reserva.setUsuario(usuario);
        reserva.setEspacio(espacio);
        Reserva savedReserva = reservaRepository.save(reserva);
        return convertToDTO(savedReserva);
    }

    public ReservaDTO updateReserva(Long id, Reserva reservaDetails) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        reserva.setEstado(reservaDetails.getEstado());
        reserva.setObservaciones(reservaDetails.getObservaciones());

        Reserva updatedReserva = reservaRepository.save(reserva);
        return convertToDTO(updatedReserva);
    }

    public void cancelarReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        reserva.setEstado(com.TecUnify.backend_user.model.EstadoReserva.CANCELADA);
        reservaRepository.save(reserva);
    }

    private ReservaDTO convertToDTO(Reserva reserva) {
        return ReservaDTO.builder()
                .id(reserva.getId())
                .usuario(userService.getUserById(reserva.getUsuario().getId()))
                .espacio(espacioService.getEspacioById(reserva.getEspacio().getId()))
                .fechaInicio(reserva.getFechaInicio())
                .fechaFin(reserva.getFechaFin())
                .estado(reserva.getEstado())
                .observaciones(reserva.getObservaciones())
                .build();
    }
}