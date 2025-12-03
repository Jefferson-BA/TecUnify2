package com.TecUnify.backend_user.dto;

import com.TecUnify.backend_user.model.Reserva;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ReservaDTO {

    private Long id;
    private Long userId;
    private Long espacioId;

    private String fechaReserva;
    private String horaInicio;
    private String horaFin;

    private String motivo;
    private String observaciones;

    private String estado;
    private Double precioTotal;

    public static ReservaDTO fromEntity(Reserva r) {
        return ReservaDTO.builder()
                .id(r.getId())
                .userId(r.getUsuario() != null ? r.getUsuario().getId() : null)
                .espacioId(r.getEspacio() != null ? r.getEspacio().getId() : null)
                .fechaReserva(r.getFechaReserva() != null ? r.getFechaReserva().toString() : null)
                .horaInicio(r.getHoraInicio() != null ? r.getHoraInicio().toString() : null)
                .horaFin(r.getHoraFin() != null ? r.getHoraFin().toString() : null)
                .motivo(r.getMotivo())
                .observaciones(r.getObservaciones())
                .estado(r.getEstado().name())
                .precioTotal(r.getPrecioTotal() != null ? r.getPrecioTotal().doubleValue() : null)
                .build();
    }
}
