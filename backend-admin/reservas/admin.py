from django.contrib import admin
from .models import Reserva


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

    @admin.action(description="Marcar como CONFIRMADA")
    def aprobar_reserva(self, request, queryset):
        updated = queryset.update(estado="CONFIRMADA")
        self.message_user(request, f"{updated} reserva(s) confirmadas.")

    @admin.action(description="Marcar como CANCELADA")
    def rechazar_reserva(self, request, queryset):
        updated = queryset.update(estado="CANCELADA")
        self.message_user(request, f"{updated} reserva(s) canceladas.")

    @admin.action(description="Marcar como COMPLETADA")
    def marcar_completada(self, request, queryset):
        updated = queryset.update(estado="COMPLETADA")
        self.message_user(request, f"{updated} reserva(s) completadas.")
