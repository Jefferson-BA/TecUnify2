package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.dto.ReservaDTO;
import com.TecUnify.backend_user.events.ReservaEventEmitter;
import com.TecUnify.backend_user.model.Reserva;
import com.TecUnify.backend_user.model.User;
import com.TecUnify.backend_user.service.ActividadService;
import com.TecUnify.backend_user.service.ReservaService;
import com.TecUnify.backend_user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    private final ReservaService reservaService;
    private final UserService userService;
    private final ReservaEventEmitter reservaEventEmitter;
    private final ActividadService actividadService;   // ⬅️ NUEVO

    // 🔵 Stream SSE para eventos de reservas (auto cancelación, etc.)
    @GetMapping("/stream")
    public SseEmitter streamReservas() {
        return reservaEventEmitter.subscribe();
    }

    // Usuario: ver solo sus reservas
    @GetMapping("/mi")
    public ResponseEntity<?> misMisReservas(@RequestParam("email") String email) {
        User user = userService.findByEmail(email);
        if (user == null) return ResponseEntity.status(404).body("Usuario no encontrado");

        List<ReservaDTO> reservas = reservaService.getByUserId(user.getId());
        return ResponseEntity.ok(reservas);
    }

    // Admin: ver todas
    @GetMapping
    public ResponseEntity<?> listarTodas(@RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body("Solo administradores");
        }
        List<ReservaDTO> list = reservaService.getAll();
        return ResponseEntity.ok(list);
    }

    // Usuario: crear reserva
    // Usuario: crear reserva
    // Usuario: crear reserva
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody ReservaDTO dto, @RequestParam("email") String email) {

        User user = userService.findByEmail(email);
        if (user == null) return ResponseEntity.status(404).body("Usuario no encontrado");

        dto.setUserId(user.getId());
        Reserva r = reservaService.create(dto);

        if (r == null) {
            return ResponseEntity.status(400).body("No se pudo crear la reserva (usuario o espacio inválido)");
        }

        actividadService.registrar(
                user.getId(),
                "RESERVA_CREADA",
                "Creaste una reserva en " + r.getEspacio().getNombre() +
                        " | Fecha: " + r.getFechaReserva() +
                        " | " + r.getHoraInicio() + " - " + r.getHoraFin()
        );

        return ResponseEntity.status(201).body(r);
    }


    // Usuario: cancelar reserva
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

        actividadService.registrar(
                user.getId(),
                "RESERVA_CANCELADA",
                "Cancelaste una reserva en " + r.getEspacio().getNombre() +
                        " | Fecha: " + r.getFechaReserva() +
                        " | " + r.getHoraInicio() + " - " + r.getHoraFin()
        );

        return ResponseEntity.ok("Cancelada");
    }

    // Admin: cambiar estado
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id,
                                           @RequestParam("estado") String estado,
                                           @RequestHeader("X-User-Role") String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body("Solo administradores");
        }

        Reserva r = reservaService.updateEstado(id, estado);
        if (r == null) return ResponseEntity.status(404).body("No encontrada");

        User destino = r.getUsuario();

        actividadService.registrar(
                destino.getId(),
                "RESERVA_ESTADO",
                "Tu reserva en " + r.getEspacio().getNombre() + " ahora está " + estado +
                        " | Fecha: " + r.getFechaReserva() +
                        " | " + r.getHoraInicio() + " - " + r.getHoraFin()
        );

        return ResponseEntity.ok(r);
    }}

