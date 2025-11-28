package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.dto.EspacioDTO;
import com.TecUnify.backend_user.events.EspacioEventEmitter;
import com.TecUnify.backend_user.model.Espacio;
import com.TecUnify.backend_user.service.EspacioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.File;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/espacios")
@CrossOrigin(origins = "*")
public class EspacioController {

    private final EspacioService espacioService;

    @Autowired
    private EspacioEventEmitter eventEmitter;

    @GetMapping
    public ResponseEntity<List<EspacioDTO>> listar() {
        return ResponseEntity.ok(espacioService.getAllActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        EspacioDTO dto = espacioService.getById(id);
        return dto != null ? ResponseEntity.ok(dto)
                : ResponseEntity.status(404).body("Espacio no encontrado");
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody EspacioDTO dto,
                                   @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role))
            return ResponseEntity.status(403).body("Solo administradores");

        Espacio creado = espacioService.create(dto);
        return ResponseEntity.status(201).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id,
                                        @RequestBody EspacioDTO dto,
                                        @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role))
            return ResponseEntity.status(403).body("Solo administradores");

        Espacio espacio = espacioService.update(id, dto);
        return espacio != null ? ResponseEntity.ok(espacio)
                : ResponseEntity.status(404).body("Espacio no encontrado");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id,
                                      @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role))
            return ResponseEntity.status(403).body("Solo administradores");

        espacioService.delete(id);
        return ResponseEntity.ok("Eliminado");
    }

    // ===========================
    //   SUBIR IMAGEN REAL
    // ===========================
    @PostMapping("/{id}/imagen")
    public ResponseEntity<?> subirImagen(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("X-User-Role") String role
    ) {

        if (!"ADMIN".equals(role))
            return ResponseEntity.status(403).body("Solo administradores");

        try {
            // 1️⃣ Crear carpeta si no existe
            File uploadDir = new File("uploads");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // 2️⃣ Guardar archivo
            String nombreArchivo = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destino = new File(uploadDir, nombreArchivo);
            file.transferTo(destino);

            // 3️⃣ Crear URL pública
            String urlPublica = "http://localhost:8081/uploads/" + nombreArchivo;

            // 4️⃣ Guardar la URL en DB
            Espacio e = espacioService.updateImagen(id, urlPublica);

            return ResponseEntity.ok(e);

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Error al subir imagen");
        }
    }


    @GetMapping("/stream")
    public SseEmitter stream() {
        return eventEmitter.subscribe();
    }
}