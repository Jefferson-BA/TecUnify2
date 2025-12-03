package com.TecUnify.backend_user.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "espacios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Espacio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, length = 200)
    private String ubicacion;

    @Column(nullable = false)
    private Integer capacidad;

    // 👇 Evita que vuelva a serializar espacios dentro del tipo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_espacio_id")
    @JsonIgnoreProperties("espacios")
    private TipoEspacio tipoEspacio;

    @Column(name = "precio_por_hora", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal precioPorHora = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String equipamiento;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Builder.Default
    private Boolean activo = true;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @OneToMany(mappedBy = "espacio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("espacio")
    private List<Reserva> reservas;

    @OneToMany(mappedBy = "espacio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("espacio")
    private List<HorarioDisponibilidad> horariosDisponibilidad;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
}
