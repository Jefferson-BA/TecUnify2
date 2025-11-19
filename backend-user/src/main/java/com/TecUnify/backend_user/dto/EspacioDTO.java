package com.TecUnify.backend_user.dto;

import com.TecUnify.backend_user.model.Espacio;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EspacioDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private String ubicacion; // <--- FALTABA ESTO
    private Integer capacidad;
    private Boolean activo;
    private String imagenUrl;
    private BigDecimal precioPorHora; // <--- FALTABA ESTO
    private String equipamiento; // <--- FALTABA ESTO
    private String tipoEspacioNombre; // <--- Útil para filtros

    public static EspacioDTO fromEntity(Espacio e) {
        return EspacioDTO.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .descripcion(e.getDescripcion())
                .ubicacion(e.getUbicacion()) // <--- Mapear ubicación
                .capacidad(e.getCapacidad())
                .activo(e.getActivo())
                .imagenUrl(e.getImagenUrl())
                .precioPorHora(e.getPrecioPorHora()) // <--- Mapear precio
                .equipamiento(e.getEquipamiento())
                .tipoEspacioNombre(e.getTipoEspacio() != null ? e.getTipoEspacio().getNombre() : "")
                .build();
    }

    public Espacio toEntity() {
        Espacio e = new Espacio();
        e.setId(this.id);
        e.setNombre(this.nombre);
        e.setDescripcion(this.descripcion);
        e.setUbicacion(this.ubicacion);
        e.setCapacidad(this.capacidad);
        e.setActivo(this.activo != null ? this.activo : true);
        e.setImagenUrl(this.imagenUrl);
        e.setPrecioPorHora(this.precioPorHora);
        e.setEquipamiento(this.equipamiento);
        return e;
    }
}