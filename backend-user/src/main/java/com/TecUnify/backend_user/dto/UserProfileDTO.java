package com.TecUnify.backend_user.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class UserProfileDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String role;

    // Estadísticas
    private int totalReservas; // Total histórico
    private int reservasActivas; // Pendientes o Confirmadas
    private int horasReservadas; // Cálculo aproximado
}