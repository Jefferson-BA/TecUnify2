package com.TecUnify.backend_user.dto;

<<<<<<< HEAD
public class ReservaDTO {
}
=======
import com.TecUnify.backend_user.model.EstadoReserva;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaDTO {
    private Long id;
    private UserDTO usuario;
    private EspacioDTO espacio;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private EstadoReserva estado;
    private String observaciones;
}
>>>>>>> jeff-B
