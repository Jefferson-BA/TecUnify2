package com.TecUnify.backend_user.events;

import com.TecUnify.backend_user.model.Reserva;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class ReservaEventEmitter {

    // Lista de todos los clientes suscritos
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        // Timeout "largo", opcionalmente puedes usar 0L (infinito)
        SseEmitter emitter = new SseEmitter(0L);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));

        // Pequeño ping inicial (no obligatorio)
        try {
            emitter.send(SseEmitter.event()
                    .name("init")
                    .data("connected"));
        } catch (IOException e) {
            emitter.complete();
            emitters.remove(emitter);
        }

        return emitter;
    }

    // Notificación específica para auto-cancelación
    public void notifyAutoCancel(Reserva reserva) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", reserva.getId());
        payload.put("usuarioId", reserva.getUsuario() != null ? reserva.getUsuario().getId() : null);
        payload.put("usuarioEmail", reserva.getUsuario() != null ? reserva.getUsuario().getEmail() : null);
        payload.put("espacioNombre", reserva.getEspacio() != null ? reserva.getEspacio().getNombre() : null);
        payload.put("fechaReserva", reserva.getFechaReserva() != null ? reserva.getFechaReserva().toString() : null);
        payload.put("horaInicio", reserva.getHoraInicio() != null ? reserva.getHoraInicio().toString() : null);
        payload.put("horaFin", reserva.getHoraFin() != null ? reserva.getHoraFin().toString() : null);
        payload.put("motivo", reserva.getMotivo());
        payload.put("observaciones", reserva.getObservaciones());

        emit("reserva-cancelada-auto", payload);
    }

    // Método genérico para emitir eventos
    public void emit(String eventName, Object data) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(
                        SseEmitter.event()
                                .name(eventName)
                                .data(data)
                );
            } catch (IOException e) {
                // Si falla, cerramos y eliminamos este emitter
                emitter.complete();
                emitters.remove(emitter);
            }
        }
    }
}
