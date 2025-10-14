package com.TecUnify.backend_user.dto;

import com.TecUnify.backend_user.model.TipoEspacio;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EspacioDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private TipoEspacio tipo;
    private Integer capacidad;
    private Double precioHora;
    private String ubicacion;
    private Boolean disponible;
}