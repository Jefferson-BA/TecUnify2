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

    // ===========================
    // 🧠 PROCESADOR CENTRAL (NLP)
    // ===========================
    public String processMessage(String message) {
        if (message == null || message.isBlank()) {
            return "🤖 No recibí ningún mensaje. Intenta escribir algo.";
        }

        String msg = message.toLowerCase();

        // ======================
        // ▪ Entrenamiento semántico
        // ======================
        if (msg.contains("tecunify") || msg.contains("que es tecunify") || msg.contains("sobre la app")) {
            return infoTecUnify();
        }

        if (msg.contains("reserva") && msg.contains("informacion")) {
            return infoReservasGenerales();
        }

        // ======================
        // ▪ Dominio principal
        // ======================
        if (msg.contains("espacios") || msg.contains("qué espacios") || msg.contains("salas") || msg.contains("ambientes")) {
            return listarEspacios();
        }

        if (msg.contains("mis reservas") || msg.contains("reservas hoy") || msg.contains("qué reservé")) {
            return listarReservasHoy();
        }

        if (msg.contains("disponible") || msg.contains("libre") || msg.contains("horario") || msg.contains("ocupado")) {
            return handleAvailability(msg);
        }

        if (msg.contains("reservar")) {
            return crearReservaSimple(msg);
        }

        if (msg.contains("regla") || msg.contains("norma") || msg.contains("política") || msg.contains("tiempo máximo")) {
            return reglas();
        }

        // ======================
        // ▪ Saludo/ayuda por defecto
        // ======================
        return saludoGeneral();
    }


    // ======================================
    // 🧩 INFORMACIÓN SOBRE TECUNIFY
    // ======================================
    private String infoTecUnify() {
        return """
                👋 **TecUnify – Sistema Inteligente de Reservas**

                TecUnify permite:
                • Reservar salas, laboratorios, canchas y ambientes
                • Consultar disponibilidad en tiempo real
                • Ver tus reservas activas y pasadas
                • Recibir confirmaciones y notificaciones
                • Gestionar reglas y políticas de uso

                Pregúntame:
                👉 “¿Qué espacios existen?”
                👉 “¿Qué reservas tengo hoy?”
                👉 “¿Está libre el laboratorio mañana?”
                👉 “Reservar sala de reuniones mañana a las 5”
                """;
    }


    // ======================================
    // 🧩 INFORMACIÓN GENERAL SOBRE RESERVAS
    // ======================================
    private String infoReservasGenerales() {
        return """
                📌 **¿Qué puedo hacer sobre reservas?**

                Con TecIA puedes:
                • Ver disponibilidad de un espacio  
                • Crear reservas simples  
                • Listar todas las reservas del día  
                • Revisar horarios ocupados  
                • Conocer reglas y tiempos máximos  

                Ejemplos:
                👉 “¿Qué reservas hay hoy?”
                👉 “¿A qué hora está libre el laboratorio?”
                👉 “Reservar sala de reuniones mañana a las 3”
                """;
    }


    // ======================================
    // 🧩 LISTAR ESPACIOS
    // ======================================
    private String listarEspacios() {

        List<Espacio> espacios = espacioRepo.findAll();

        if (espacios.isEmpty())
            return "❌ No hay espacios registrados en TecUnify.";

        StringBuilder sb = new StringBuilder("📍 **Espacios disponibles en TecUnify:**\n\n");

        for (Espacio e : espacios) {
            sb.append("• ")
                    .append(e.getNombre());

            if (e.getTipoEspacio() != null) {
                sb.append(" — ").append(e.getTipoEspacio().getNombre());
            }

            sb.append("\n");
        }

        return sb.toString();
    }


    // ======================================
    // 🧩 LISTAR RESERVAS DEL DÍA
    // ======================================
    private String listarReservasHoy() {

        LocalDate hoy = LocalDate.now();

        List<Reserva> reservas = reservaRepo.findAll()
                .stream()
                .filter(r -> r.getFechaReserva().equals(hoy))
                .collect(Collectors.toList());

        if (reservas.isEmpty()) {
            return "📅 No hay reservas registradas para hoy.";
        }

        StringBuilder sb = new StringBuilder("📅 **Reservas de hoy:**\n\n");

        for (Reserva r : reservas) {
            sb.append("• ").append(r.getEspacio().getNombre())
                    .append(" — ").append(r.getHoraInicio())
                    .append(" a ").append(r.getHoraFin())
                    .append(" (Estado: ").append(r.getEstado()).append(")")
                    .append("\n");
        }

        return sb.toString();
    }


    // ======================================
    // 🧩 CREAR RESERVA SIMPLE
    // ======================================
    private String crearReservaSimple(String msg) {

        List<Espacio> espacios = espacioRepo.findAll();

        Espacio espacio = espacios.stream()
                .filter(e -> msg.contains(e.getNombre().toLowerCase()))
                .findFirst()
                .orElse(null);

        if (espacio == null)
            return "❓ No entendí qué espacio quieres reservar. Intenta especificar el nombre exacto.";

        LocalDate fecha = detectarFecha(msg);
        LocalTime horaInicio = LocalTime.of(17, 0);
        LocalTime horaFin = horaInicio.plusHours(1);

        boolean ocupado = reservaRepo.findAll()
                .stream()
                .anyMatch(r ->
                        r.getFechaReserva().equals(fecha) &&
                                r.getEspacio().getId().equals(espacio.getId()) &&
                                r.getHoraInicio().equals(horaInicio)
                );

        if (ocupado)
            return "❌ Ese horario ya está reservado.";

        Reserva r = new Reserva();
        r.setEspacio(espacio);
        r.setFechaReserva(fecha);
        r.setHoraInicio(horaInicio);
        r.setHoraFin(horaFin);
        r.setEstado(EstadoReserva.PENDIENTE);

        reservaRepo.save(r);

        return "✅ Reserva creada exitosamente para **" + espacio.getNombre() +
                "** el " + fecha + " a las " + horaInicio + ".";
    }


    // ======================================
    // 🧩 DISPONIBILIDAD REAL DEL ESPACIO
    // ======================================
    private String handleAvailability(String msg) {

        List<Espacio> espacios = espacioRepo.findAll();

        Espacio espacioEncontrado = espacios.stream()
                .filter(e -> msg.contains(e.getNombre().toLowerCase()))
                .findFirst()
                .orElse(null);

        if (espacioEncontrado == null)
            return "❓ No encontré ese espacio. Asegúrate de escribir su nombre.";

        LocalDate fecha = detectarFecha(msg);

        List<Reserva> activas = reservaRepo.findAll()
                .stream()
                .filter(r -> r.getEspacio().getId().equals(espacioEncontrado.getId()))
                .filter(r -> r.getFechaReserva().equals(fecha))
                .filter(r -> r.getEstado() == EstadoReserva.CONFIRMADA ||
                        r.getEstado() == EstadoReserva.PENDIENTE)
                .sorted(Comparator.comparing(Reserva::getHoraInicio))
                .collect(Collectors.toList());

        if (activas.isEmpty()) {
            return "✅ *" + espacioEncontrado.getNombre() +
                    "* está libre todo el día **" + fecha + "**.";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("📅 **Disponibilidad de ").append(espacioEncontrado.getNombre())
                .append(" el ").append(fecha).append(":**\n\n");

        sb.append("Horarios ocupados:\n");
        for (Reserva r : activas) {
            sb.append("• ").append(r.getHoraInicio())
                    .append(" - ").append(r.getHoraFin()).append("\n");
        }

        sb.append("\n🔍 Sugerencia:\n");
        sb.append(sugerirHorarioLibre(activas));

        return sb.toString();
    }


    // ======================================
    // 🧩 SUGERIR HORARIO LIBRE
    // ======================================
    private String sugerirHorarioLibre(List<Reserva> reservas) {

        LocalTime inicioDia = LocalTime.of(8, 0);
        LocalTime finDia = LocalTime.of(22, 0);

        LocalTime cursor = inicioDia;

        for (Reserva r : reservas) {
            if (cursor.isBefore(r.getHoraInicio())) {
                return "🟢 Está libre de **" + cursor + " a " + r.getHoraInicio() + "**.";
            }
            cursor = r.getHoraFin();
        }

        if (cursor.isBefore(finDia)) {
            return "🟢 Libre desde **" + cursor + " en adelante**.";
        }

        return "❌ No hay horarios libres ese día.";
    }


    // ======================================
    // 🧩 DETECTAR FECHA POR NLP
    // ======================================
    private LocalDate detectarFecha(String msg) {
        if (msg.contains("mañana")) return LocalDate.now().plusDays(1);
        if (msg.contains("hoy")) return LocalDate.now();
        return LocalDate.now();
    }


    // ======================================
    // 🧩 REGLAS GENERALES
    // ======================================
    private String reglas() {
        return """
                📌 **Reglas de uso de los espacios:**
                • Máximo 2 horas por reserva  
                • Llegar dentro de los primeros 15 minutos  
                • No consumir alimentos  
                • Mantener silencio  
                • Cancelar con 30 minutos de anticipación  
                • Respetar el mobiliario y equipamiento  
                """;
    }


    // ======================================
    // 🧩 SALUDO GENERAL
    // ======================================
    private String saludoGeneral() {
        return """
                👋 Hola, soy **TecIA**, tu asistente inteligente de TecUnify.

                Puedo ayudarte con:
                • Consultar disponibilidad  
                • Ver tus reservas  
                • Crear reservas  
                • Listar espacios  
                • Explicar reglas de uso  

                Ejemplos:
                👉 “¿Qué espacios existen?”  
                👉 “¿Está libre la sala de reuniones mañana?”  
                👉 “Quiero reservar el laboratorio mañana a las 5”  
                """;
    }

}
