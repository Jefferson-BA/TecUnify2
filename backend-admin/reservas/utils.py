# reservas/utils.py
import requests

SPRING_BASE_URL = "http://localhost:8081/api/reservas"

def actualizar_estado_reserva(reserva_id, nuevo_estado):
    """
    Llama al backend Spring Boot para actualizar el estado de una reserva.
    """

    url = f"{SPRING_BASE_URL}/{reserva_id}/estado?estado={nuevo_estado}"

    try:
        response = requests.put(url, headers={"X-User-Role": "ADMIN"}, timeout=5)
        print(f"[DEBUG] Respuesta Spring Boot ({nuevo_estado}):", response.status_code)

        return response.status_code == 200
    except Exception as e:
        print("[ERROR] No se pudo conectar con Spring Boot:", e)
        return False
