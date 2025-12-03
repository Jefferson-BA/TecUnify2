package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.dto.EspacioDTO;
import com.TecUnify.backend_user.events.EspacioEventEmitter;
import com.TecUnify.backend_user.model.Espacio;
import com.TecUnify.backend_user.service.EspacioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.File;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/espacios")
@CrossOrigin(origins = "*")
public class EspacioController {

    private final EspacioService espacioService;

    @Autowired
    private EspacioEventEmitter eventEmitter;

    // =========================
    //   LISTAR (SOLO DTOs)
    // =========================
    @GetMapping
    public ResponseEntity<List<EspacioDTO>> listar() {
        return ResponseEntity.ok(espacioService.getAllActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        EspacioDTO dto = espacioService.getById(id);
        return dto != null
                ? ResponseEntity.ok(dto)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Espacio no encontrado");
    }

    // =========================
    //   CREAR (DEVUELVE DTO)
    // =========================
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody EspacioDTO dto,
                                   @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo administradores");
        }

        Espacio creado = espacioService.create(dto);
        EspacioDTO salida = EspacioDTO.fromEntity(creado);

        return ResponseEntity.status(HttpStatus.CREATED).body(salida);
    }

    // =========================
    //   ACTUALIZAR (DTO)
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id,
                                        @RequestBody EspacioDTO dto,
                                        @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo administradores");
        }

        Espacio actualizado = espacioService.update(id, dto);
        if (actualizado == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Espacio no encontrado");
        }

        EspacioDTO salida = EspacioDTO.fromEntity(actualizado);
        return ResponseEntity.ok(salida);
    }

    // =========================
    //   ELIMINAR (SOFT DELETE)
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id,
                                      @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo administradores");
        }

        espacioService.delete(id);
        return ResponseEntity.ok("Eliminado");
    }

    // =========================
    //   SUBIR IMAGEN REAL
    //   → GUARDA ARCHIVO
    //   → ACTUALIZA imagenUrl
    //   → DEVUELVE DTO
    // =========================
    @PostMapping("/{id}/imagen")
    public ResponseEntity<?> subirImagen(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("X-User-Role") String role
    ) {

        if (!"ADMIN".equals(role))
            return ResponseEntity.status(403).body("Solo administradores");

        try {
            // 📌 Ruta ABSOLUTA real en tu PC
            String UPLOAD_DIR = "C:/TecUnify1.2/uploads/";

            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            // Guardar archivo
            String nombreArchivo = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destino = new File(UPLOAD_DIR + nombreArchivo);
            file.transferTo(destino);

            // URL pública
            String urlPublica = "http://localhost:8081/uploads/" + nombreArchivo;

            Espacio e = espacioService.updateImagen(id, urlPublica);
            return ResponseEntity.ok(EspacioDTO.fromEntity(e));

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Error al subir imagen");
        }
    }


    // =========================
    //   STREAM SSE
    // =========================
    @GetMapping("/stream")
    public SseEmitter stream() {
        return eventEmitter.subscribe();
    }
}
