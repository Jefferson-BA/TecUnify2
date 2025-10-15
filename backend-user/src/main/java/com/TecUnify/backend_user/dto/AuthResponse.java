package com.TecUnify.backend_user.dto;

<<<<<<< HEAD
public class AuthResponse {
=======
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private UserDTO user;
    private String message;
>>>>>>> jeff-B
}
