package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.dto.LoginRequest;
import com.TecUnify.backend_user.dto.AuthResponse;
import com.TecUnify.backend_user.dto.UserDTO;
import com.TecUnify.backend_user.model.User;
import com.TecUnify.backend_user.model.Role;
import com.TecUnify.backend_user.service.UserService;
import com.TecUnify.backend_user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            user.setRole(Role.USER);
            UserDTO savedUser = userService.createUser(user);

            // Token simple por ahora (luego implementamos JWT real)
            String token = "token_" + savedUser.getId() + "_" + System.currentTimeMillis();

            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .user(savedUser)
                    .message("Usuario registrado exitosamente")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Buscar usuario por email
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Verificar contraseña
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body("Credenciales inválidas");
            }

            // Convertir a DTO
            UserDTO userDTO = UserDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .phone(user.getPhone())
                    .role(user.getRole())
                    .active(user.getActive())
                    .build();

            // Token simple
            String token = "token_" + user.getId() + "_" + System.currentTimeMillis();

            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .user(userDTO)
                    .message("Login exitoso")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Credenciales inválidas");
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body("Token no proporcionado");
        }

        // Por ahora solo devolvemos que es válido
        return ResponseEntity.ok().body("{\"valid\": true}");
    }
}