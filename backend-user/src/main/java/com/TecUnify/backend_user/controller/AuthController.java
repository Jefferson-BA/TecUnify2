package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.dto.LoginRequest;
import com.TecUnify.backend_user.dto.AuthResponse;
import com.TecUnify.backend_user.dto.UserDTO;
import com.TecUnify.backend_user.model.User;
import com.TecUnify.backend_user.model.Role;
import com.TecUnify.backend_user.service.UserService;
import com.TecUnify.backend_user.security.JwtUtil;
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
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            user.setRole(Role.USER);
            UserDTO savedUser = userService.createUser(user);
            String token = jwtUtil.generateToken(savedUser.getEmail());

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
            UserDTO user = userService.getUserByEmail(request.getEmail());
            String token = jwtUtil.generateToken(user.getEmail());

            AuthResponse response = AuthResponse.builder()
                    .token(token)
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
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        boolean isValid = jwtUtil.validateToken(token);
        if (isValid) {
            String email = jwtUtil.extractEmail(token);
            UserDTO user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.badRequest().body("Token inválido");
    }
}