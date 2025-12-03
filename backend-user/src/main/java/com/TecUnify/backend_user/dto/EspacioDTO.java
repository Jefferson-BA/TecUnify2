package com.TecUnify.backend_user.dto;

import com.TecUnify.backend_user.model.Espacio;
import com.TecUnify.backend_user.model.TipoEspacio;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EspacioDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private Integer capacidad;
    private Boolean activo;
    private String imagenUrl;

    private String ubicacion;

    // 🔹 Relación con tipo de espacio
    private Long tipoEspacioId;
    private String tipoEspacioNombre;

    // 🔹 Precio por hora
    private Double precioPorHora;

    // 🔹 Equipamiento extra
    private String equipamiento;

    // 🔹 Estado calculado (Disponible / Ocupado)
    private String estado;

    public static EspacioDTO fromEntity(Espacio e) {
        if (e == null) return null;

        TipoEspacio tipo = e.getTipoEspacio();

        return EspacioDTO.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .descripcion(e.getDescripcion())
                .capacidad(e.getCapacidad())
                .activo(e.getActivo())
                .imagenUrl(e.getImagenUrl())
                .ubicacion(e.getUbicacion())
                .tipoEspacioId(tipo != null ? tipo.getId() : null)
                .tipoEspacioNombre(tipo != null ? tipo.getNombre() : null)
                .precioPorHora(e.getPrecioPorHora() != null ? e.getPrecioPorHora().doubleValue() : null)
                .equipamiento(e.getEquipamiento())
                // estado lo setea el service
                .build();
    }

    public Espacio toEntity() {
        Espacio e = new Espacio();
        e.setId(this.id);
        e.setNombre(this.nombre);
        e.setDescripcion(this.descripcion);
        e.setCapacidad(this.capacidad);
        e.setActivo(this.activo != null ? this.activo : true);
        e.setUbicacion(this.ubicacion);
        e.setEquipamiento(this.equipamiento);

        // ⚠️ MUY IMPORTANTE PARA EL CHECK: NO GUARDAR ""
        if (this.imagenUrl != null && !this.imagenUrl.trim().isEmpty()) {
            e.setImagenUrl(this.imagenUrl.trim());
        } else {
            e.setImagenUrl(null);
        }

        // tipoEspacio y precioPorHora los setea el service
        return e;
    }
}
