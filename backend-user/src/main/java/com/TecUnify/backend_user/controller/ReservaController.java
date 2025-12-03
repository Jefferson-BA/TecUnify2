package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.dto.ReservaDTO;
import com.TecUnify.backend_user.events.ReservaEventEmitter;
import com.TecUnify.backend_user.model.Reserva;
import com.TecUnify.backend_user.model.User;
import com.TecUnify.backend_user.service.ActividadService;
import com.TecUnify.backend_user.service.ReservaService;
import com.TecUnify.backend_user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
@Slf4j
public class ReservaController {

    private final ReservaService reservaService;
    private final UserService userService;
    private final ReservaEventEmitter reservaEventEmitter;
    private final ActividadService actividadService;

    // SSE para reservas
    @GetMapping("/stream")
    public SseEmitter streamReservas() {
        return reservaEventEmitter.subscribe();
    }

    // Usuario ve solo sus reservas
    @GetMapping("/mi")
    public ResponseEntity<?> misMisReservas(@RequestParam("email") String email) {
        User user = userService.findByEmail(email);
        if (user == null) return ResponseEntity.status(404).body("Usuario no encontrado");
        return ResponseEntity.ok(reservaService.getByUserId(user.getId()));
    }

    // Admin: ver todas
    @GetMapping
    public ResponseEntity<?> listarTodas(@RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role))
            return ResponseEntity.status(403).body("Solo administradores");

        return ResponseEntity.ok(reservaService.getAllAdmin());
    }


    // Crear reserva (usuario)
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody ReservaDTO dto, @RequestParam("email") String email) {

        User user = userService.findByEmail(email);
        if (user == null) return ResponseEntity.status(404).body("Usuario no encontrado");

        dto.setUserId(user.getId());
        Reserva r = reservaService.create(dto);

        if (r == null) {
            return ResponseEntity.status(400).body("No se pudo crear la reserva (usuario o espacio inválido)");
        }

        // Actividad
        try {
            actividadService.registrar(
                    user.getId(),
                    "RESERVA_CREADA",
                    "Creaste una reserva en " + r.getEspacio().getNombre() +
                            " | Fecha: " + r.getFechaReserva() +
                            " | " + r.getHoraInicio() + " - " + r.getHoraFin()
            );
        } catch (Exception e) {
            log.warn("Error registrando actividad RESERVA_CREADA: {}", e.getMessage());
        }

        return ResponseEntity.status(201).body(ReservaDTO.fromEntity(r));
    }

    // Cancelar reserva (usuario)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelar(@PathVariable Long id, @RequestParam("email") String email) {

        User user = userService.findByEmail(email);
        if (user == null) return ResponseEntity.status(404).body("Usuario no encontrado");

        Reserva r = reservaService.getById(id);
        if (r == null) return ResponseEntity.status(404).body("Reserva no encontrada");

        if (!r.getUsuario().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("No puedes cancelar esta reserva");
        }

        reservaService.delete(id);

        try {
            actividadService.registrar(
                    user.getId(),
                    "RESERVA_CANCELADA",
                    "Cancelaste una reserva en " + r.getEspacio().getNombre() +
                            " | Fecha: " + r.getFechaReserva() +
                            " | " + r.getHoraInicio() + " - " + r.getHoraFin()
            );
        } catch (Exception e) {
            log.warn("Error registrando actividad RESERVA_CANCELADA: {}", e.getMessage());
        }

        return ResponseEntity.ok("Cancelada");
    }

    // Admin actualiza estado
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Long id,
            @RequestParam("estado") String estado,
            @RequestHeader("X-User-Role") String role
    ) {

        if (!"ADMIN".equals(role))
            return ResponseEntity.status(403).body("Solo administradores");

        ReservaDTO dto = reservaService.updateEstado(id, estado);
        if (dto == null) return ResponseEntity.status(404).body("No encontrada");

        // Registrar actividad (no rompe la respuesta)
        try {
            actividadService.registrar(
                    dto.getUserId(),
                    "RESERVA_ESTADO",
                    "Tu reserva ahora está: " + estado
            );
        } catch (Exception e) {
            log.warn("Error registrando actividad RESERVA_ESTADO: {}", e.getMessage());
        }

        return ResponseEntity.ok(dto);
    }
}
