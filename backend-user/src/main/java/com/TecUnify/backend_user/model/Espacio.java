package com.TecUnify.backend_user.model;

<<<<<<< HEAD
public class Espacio {
}
=======
import jakarta.persistence.*;
import lombok.*;
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

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    private TipoEspacio tipo;

    @Column(nullable = false)
    private Integer capacidad;

    @Column(nullable = false)
    private Double precioHora;

    private String ubicacion;

    @Column(nullable = false)
    private Boolean disponible = true;

    @OneToMany(mappedBy = "espacio", cascade = CascadeType.ALL)
    private List<Reserva> reservas;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
>>>>>>> jeff-B
