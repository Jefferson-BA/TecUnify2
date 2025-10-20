package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.dto.LoginRequest;
import com.TecUnify.backend_user.dto.AuthResponse;
import com.TecUnify.backend_user.dto.UserDTO;
import com.TecUnify.backend_user.model.User;
import com.TecUnify.backend_user.model.Role;
import com.TecUnify.backend_user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            user.setRole(Role.USER);
            UserDTO savedUser = userService.createUser(user);
            AuthResponse response = AuthResponse.builder()
                    .token(null)
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
            UserDTO user = userService.getUserByEmail(request.getEmail());
            AuthResponse response = AuthResponse.builder()
                    .token(null)
                    .user(user)
                    .message("Login exitoso")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Credenciales inválidas");
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        // With security removed, accept a plain email in Authorization header for validation (or send back bad request)
        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Authorization header vacío");
        }
        String email = token.startsWith("Bearer ") ? token.substring(7) : token;
        try {
            UserDTO user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
    }
}