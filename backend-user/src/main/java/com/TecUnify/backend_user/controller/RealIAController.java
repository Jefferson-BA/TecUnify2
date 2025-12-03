package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ia")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RealIAController {

    private final GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody Map<String, String> body) {

        String prompt = body.get("message");

        String response = geminiService.ask(prompt);

        // devolvemos solo el texto limpio
        return ResponseEntity.ok(response);
    }

}
