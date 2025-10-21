package com.TecUnify.backend_user.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad de JPA que representa la tabla 'users' en la base de datos.
 * Utiliza Lombok para reducir el boilerplate (constructores, getters/setters).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String password; // NOTA: En un entorno real, esta contraseña NUNCA debe guardarse sin cifrar.

    private String firstName;

    private String lastName;

    private String phone;

    // El campo Role usa la clase Role (Enum) que también debe existir.
    @Enumerated(EnumType.STRING)
    private Role role;

    private Boolean active = true;
}
