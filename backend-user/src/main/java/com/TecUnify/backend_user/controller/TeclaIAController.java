package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.service.TeclaIAService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/tecla")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173"
})
public class TeclaIAController {

    private final TeclaIAService teclaIAService;

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody Map<String, String> body) {
        String userMessage = body.get("message");
        String response = teclaIAService.processMessage(userMessage);
        return ResponseEntity.ok(response);
    }
}
