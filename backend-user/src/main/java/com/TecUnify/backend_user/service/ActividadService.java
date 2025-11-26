package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.dto.ActividadDTO;
import com.TecUnify.backend_user.events.ActividadEventEmitter;
import com.TecUnify.backend_user.model.Actividad;
import com.TecUnify.backend_user.repository.ActividadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
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

        a = repo.save(a); // IMPORTANTE: usar el que vuelve con ID

        ActividadDTO dto = ActividadDTO.fromEntity(a);
        emitter.sendActividad(dto);
    }

    // Listar actividades del usuario como DTO
    public List<ActividadDTO> listarPorUsuario(Long userId) {
        return repo.findByUsuarioIdOrderByFechaDesc(userId)
                .stream()
                .map(ActividadDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
