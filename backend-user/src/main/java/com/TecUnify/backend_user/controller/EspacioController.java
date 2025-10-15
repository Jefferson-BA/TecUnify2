package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.dto.EspacioDTO;
import com.TecUnify.backend_user.model.Espacio;
import com.TecUnify.backend_user.model.TipoEspacio;
import com.TecUnify.backend_user.service.EspacioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/espacios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class EspacioController {
    private final EspacioService espacioService;

    @GetMapping
    public ResponseEntity<List<EspacioDTO>> getAllEspacios() {
        return ResponseEntity.ok(espacioService.getAllEspacios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EspacioDTO> getEspacioById(@PathVariable Long id) {
        return ResponseEntity.ok(espacioService.getEspacioById(id));
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<EspacioDTO>> getEspaciosByTipo(@PathVariable TipoEspacio tipo) {
        return ResponseEntity.ok(espacioService.getEspaciosByTipo(tipo));
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<EspacioDTO>> getEspaciosDisponibles() {
        return ResponseEntity.ok(espacioService.getEspaciosDisponibles());
    }

    @PostMapping
    public ResponseEntity<EspacioDTO> createEspacio(@RequestBody Espacio espacio) {
        return ResponseEntity.ok(espacioService.createEspacio(espacio));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EspacioDTO> updateEspacio(
            @PathVariable Long id,
            @RequestBody Espacio espacioDetails) {
        return ResponseEntity.ok(espacioService.updateEspacio(id, espacioDetails));
    }
}