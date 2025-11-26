package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.dto.ActividadDTO;
import com.TecUnify.backend_user.service.ActividadService;
import com.TecUnify.backend_user.service.UserService;
import com.TecUnify.backend_user.events.ActividadEventEmitter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/actividad")
@CrossOrigin(origins = "*")
public class ActividadController {

    private final ActividadService actividadService;
    private final UserService userService;
    private final ActividadEventEmitter actividadEventEmitter;

    // SSE
    @GetMapping("/stream")
    public SseEmitter stream() {
        return actividadEventEmitter.subscribe();
    }

    // Listar actividades del usuario
    @GetMapping
    public ResponseEntity<?> listar(@RequestParam("email") String email) {

        var user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        List<ActividadDTO> actividades = actividadService.listarPorUsuario(user.getId());
        return ResponseEntity.ok(actividades);
    }
}
