package com.TecUnify.backend_user.events;

import com.TecUnify.backend_user.dto.ActividadDTO;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class ActividadEventEmitter {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L); // sin timeout
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));

        // Enviar ping al inicio
        try {
            emitter.send(SseEmitter.event().name("connected").data("ok"));
        } catch (Exception ignored) {}

        return emitter;
    }

    public void sendActividad(ActividadDTO dto) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(
                        SseEmitter.event()
                                .name("actividad")
                                .data(dto)
                );
            } catch (Exception e) {
                emitter.complete();
            }
        }
    }

    // 🔵 Heartbeat para mantener SSE vivo
    @Scheduled(fixedRate = 15000)  // cada 15 segundos
    public void heartbeat() {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("ping").data("alive"));
            } catch (Exception e) {
                emitter.complete();
            }
        }
    }
}
