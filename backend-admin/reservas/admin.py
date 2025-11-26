from django.contrib import admin
from .models import Reserva
from .utils import actualizar_estado_reserva

@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "usuario_id",
        "espacio_id",
        "fecha_reserva",
        "hora_inicio",
        "hora_fin",
        "estado",
        "precio_total",
    )

    list_filter = ("estado", "fecha_reserva", "espacio_id")
    search_fields = ("usuario_id", "espacio_id", "motivo")
    ordering = ("-fecha_reserva", "-hora_inicio")

    actions = ["aprobar_reserva", "rechazar_reserva", "marcar_completada"]

    # 🔵 CONFIRMAR
    @admin.action(description="Marcar como CONFIRMADA")
    def aprobar_reserva(self, request, queryset):
        count = 0
        for r in queryset:
            if actualizar_estado_reserva(r.id, "CONFIRMADA"):
                count += 1
        self.message_user(request, f"{count} reserva(s) confirmadas correctamente desde Spring Boot.")

    # 🔵 CANCELAR
    @admin.action(description="Marcar como CANCELADA")
    def rechazar_reserva(self, request, queryset):
        count = 0
        for r in queryset:
            if actualizar_estado_reserva(r.id, "CANCELADA"):
                count += 1
        self.message_user(request, f"{count} reserva(s) canceladas correctamente desde Spring Boot.")

    # 🔵 COMPLETAR
    @admin.action(description="Marcar como COMPLETADA")
    def marcar_completada(self, request, queryset):
        count = 0
        for r in queryset:
            if actualizar_estado_reserva(r.id, "COMPLETADA"):
                count += 1
        self.message_user(request, f"{count} reserva(s) completadas correctamente desde Spring Boot.")
