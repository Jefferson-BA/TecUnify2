package com.TecUnify.backend_user.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservaAdminDTO {

    private Long id;

    private Long userId;
    private String usuarioNombre;

    private Long espacioId;
    private String espacioNombre;

    private String fechaReserva;
    private String horaInicio;
    private String horaFin;

    private String motivo;
    private String estado;
}
