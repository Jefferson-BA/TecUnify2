package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.model.Espacio;
import com.TecUnify.backend_user.model.EstadoReserva;
import com.TecUnify.backend_user.model.Reserva;
import com.TecUnify.backend_user.repository.EspacioRepository;
import com.TecUnify.backend_user.repository.ReservaRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class TeclaIAService {

    private final EspacioRepository espacioRepo;
    private final ReservaRepository reservaRepo;

    // ===============================
    // 🧠 PROCESADOR PRINCIPAL
    // ===============================
    public String processMessage(String message) {

        String msg = message.toLowerCase();

        // 1) Buscar disponibilidad
        if (msg.contains("disponible") || msg.contains("horario") || msg.contains("hora") || msg.contains("reservado")) {
            return handleAvailability(msg);
        }

        // 2) Reglas del espacio
        if (msg.contains("regla") || msg.contains("norma") || msg.contains("tiempo") || msg.contains("puedo usar")) {
            return """
                    📌 **Reglas de uso:**
                    • Máximo 2 horas por reserva  
                    • Llegar en los primeros 15 minutos  
                    • No consumir alimentos  
                    • Mantener silencio  
                    • Cancelar con 30 min de anticipación
                    """;
        }

        // 3) Responder básico
        return """
                Hola 👋, soy TecIA.
                Puedo ayudarte con:
                • Horarios disponibles  
                • Consultar si un espacio está ocupado  
                • Explicar reglas de uso  
                • Sugerirte la mejor hora para reservar
                
                Por ejemplo:  
                👉 "¿Qué horas está libre la Sala de Reuniones mañana?"
                """;
    }


    // ===============================================================
    // 🧠 RESPUESTAS INTELIGENTES: DISPONIBILIDAD Y SUGERENCIAS REALES
    // ===============================================================
    private String handleAvailability(String msg) {

        // 1) Detectar espacio por nombre
        List<Espacio> espacios = espacioRepo.findAll();

        Espacio espacioEncontrado = espacios.stream()
                .filter(e -> msg.contains(e.getNombre().toLowerCase()))
                .findFirst()
                .orElse(null);

        if (espacioEncontrado == null) {
            return "❓ No entendí qué espacio quieres consultar. Intenta: Sala, Laboratorio, Cancha…";
        }

        // 2) Detectar fecha (si dice "hoy", "mañana")
        LocalDate fecha = detectarFecha(msg);

        // 3) Sacar reservas activas del espacio
        List<Reserva> activas = reservaRepo.findByEspacioIdAndEstadoIn(
                espacioEncontrado.getId(),
                List.of(EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA)
        );

        activas = activas.stream()
                .filter(r -> r.getFechaReserva().equals(fecha))
                .sorted(Comparator.comparing(Reserva::getHoraInicio))
                .collect(Collectors.toList());

        if (activas.isEmpty()) {
            return "✅ *" + espacioEncontrado.getNombre() + "* está totalmente libre el " + fecha + ".";
        }

        // 4) Sugerencias automáticas de horario
        StringBuilder respuesta = new StringBuilder();
        respuesta.append("📅 Disponibilidad de **").append(espacioEncontrado.getNombre())
                .append("** el ").append(fecha).append(":\n\n");

        respuesta.append("Horarios ocupados:\n");
        for (Reserva r : activas) {
            respuesta.append("• ").append(r.getHoraInicio()).append(" - ").append(r.getHoraFin()).append("\n");
        }

        respuesta.append("\n🔍 Sugerencias:\n");
        String sugerencia = sugerirHorarioLibre(activas);
        respuesta.append(sugerencia);

        return respuesta.toString();
    }


    // ======================
    // CALCULAR HORAS LIBRES
    // ======================
    private String sugerirHorarioLibre(List<Reserva> reservas) {

        LocalTime inicioDia = LocalTime.of(8, 0);
        LocalTime finDia = LocalTime.of(22, 0);

        List<LocalTime[]> ocupados = reservas.stream()
                .map(r -> new LocalTime[] { r.getHoraInicio(), r.getHoraFin() })
                .collect(Collectors.toList());

        // Buscar huecos
        LocalTime cursor = inicioDia;

        for (LocalTime[] bloque : ocupados) {

            if (cursor.isBefore(bloque[0])) {
                return "🟢 Libre de **" + cursor + " a " + bloque[0] + "**";
            }

            cursor = bloque[1];
        }

        if (cursor.isBefore(finDia)) {
            return "🟢 Libre desde **" + cursor + " en adelante**";
        }

        return "❌ No hay horarios libres este día.";
    }


    // ======================
    // DETECTAR FECHA
    // ======================
    private LocalDate detectarFecha(String msg) {
        if (msg.contains("mañana")) return LocalDate.now().plusDays(1);
        if (msg.contains("hoy")) return LocalDate.now();
        return LocalDate.now(); // por defecto hoy
    }

}
