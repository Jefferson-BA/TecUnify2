package com.TecUnify.backend_user.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User usuario;

    @ManyToOne
    @JoinColumn(name = "espacio_id", nullable = false)
    private Espacio espacio;

    @Column(nullable = false)
    private LocalDateTime fechaInicio;

    @Column(nullable = false)
    private LocalDateTime fechaFin;

    @Enumerated(EnumType.STRING)
    private EstadoReserva estado;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        estado = EstadoReserva.PENDIENTE;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
