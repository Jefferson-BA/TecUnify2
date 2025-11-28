package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.dto.ActividadDTO;
import com.TecUnify.backend_user.events.ActividadEventEmitter;
import com.TecUnify.backend_user.model.Actividad;
import com.TecUnify.backend_user.repository.ActividadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActividadService {

    private final ActividadRepository repo;
    private final ActividadEventEmitter emitter;

    // Registrar y emitir por SSE
    public void registrar(Long userId, String accion, String detalle) {

        Actividad a = new Actividad();
        a.setUsuarioId(userId);
        a.setAccion(accion);
        a.setDetalle(detalle);
        a.setFecha(LocalDateTime.now());

        a = repo.save(a); // usar el que vuelve con ID

        ActividadDTO dto = ActividadDTO.fromEntity(a);

        // 🔒 NUNCA permitimos que errores de SSE rompan la petición HTTP
        try {
            emitter.sendActividad(dto);
        } catch (Exception e) {
            log.warn("No se pudo enviar actividad SSE para usuario {}: {}", userId, e.getMessage());
            // NO lanzamos la excepción, solo lo registramos
        }
    }

    // Listar actividades del usuario como DTO
    public List<ActividadDTO> listarPorUsuario(Long userId) {
        return repo.findByUsuarioIdOrderByFechaDesc(userId)
                .stream()
                .map(ActividadDTO::fromEntity)
                .collect(Collectors.toList());
    }
}