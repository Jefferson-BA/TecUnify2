
package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.dto.ReservaDTO;
import com.TecUnify.backend_user.model.Reserva;
import com.TecUnify.backend_user.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReservaController {
    private final ReservaService reservaService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReservaDTO>> getReservasByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.getReservasByUsuario(usuarioId));
    }

    @GetMapping("/espacio/{espacioId}")
    public ResponseEntity<List<ReservaDTO>> getReservasByEspacio(@PathVariable Long espacioId) {
        return ResponseEntity.ok(reservaService.getReservasByEspacio(espacioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaDTO> getReservaById(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.getReservaById(id));
    }

    @PostMapping
    public ResponseEntity<?> createReserva(@RequestBody Reserva reserva) {
        try {
            return ResponseEntity.ok(reservaService.createReserva(reserva));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaDTO> updateReserva(
            @PathVariable Long id,
            @RequestBody Reserva reservaDetails) {
        return ResponseEntity.ok(reservaService.updateReserva(id, reservaDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelarReserva(@PathVariable Long id) {
        reservaService.cancelarReserva(id);
        return ResponseEntity.ok("Reserva cancelada");
    }
}