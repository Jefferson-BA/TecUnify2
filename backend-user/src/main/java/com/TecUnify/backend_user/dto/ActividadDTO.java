package com.TecUnify.backend_user.dto;

import com.TecUnify.backend_user.model.Actividad;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActividadDTO {

    private Long id;
    private Long usuarioId;
    private String accion;
    private String detalle;
    private LocalDateTime timestamp;

    public static ActividadDTO fromEntity(Actividad a) {
        return ActividadDTO.builder()
                .id(a.getId())
                .usuarioId(a.getUsuarioId())
                .accion(a.getAccion())
                .detalle(a.getDetalle())
                .timestamp(a.getFecha())   // OK
                .build();
    }
}
