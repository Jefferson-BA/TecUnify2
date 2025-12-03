package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.dto.EspacioDTO;
import com.TecUnify.backend_user.model.Espacio;
import com.TecUnify.backend_user.model.EstadoReserva;
import com.TecUnify.backend_user.model.Reserva;
import com.TecUnify.backend_user.model.TipoEspacio;
import com.TecUnify.backend_user.repository.EspacioRepository;
import com.TecUnify.backend_user.repository.ReservaRepository;
import com.TecUnify.backend_user.repository.TipoEspacioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class EspacioService {

    private final EspacioRepository espacioRepository;
    private final ReservaRepository reservaRepository;
    private final TipoEspacioRepository tipoEspacioRepository;

    // =============================
    //   LISTAR ACTIVOS → DTOs
    // =============================
    public List<EspacioDTO> getAllActivos() {
        return espacioRepository.findByActivoTrue().stream()
                .map(e -> {
                    EspacioDTO dto = EspacioDTO.fromEntity(e);

                    List<Reserva> activas = reservaRepository
                            .findByEspacioIdAndEstadoIn(
                                    e.getId(),
                                    List.of(EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA)
                            );

                    dto.setEstado(activas.isEmpty() ? "Disponible" : "Ocupado");
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // =============================
    //   OBTENER POR ID → DTO
    // =============================
    public EspacioDTO getById(Long id) {
        return espacioRepository.findById(id)
                .map(EspacioDTO::fromEntity)
                .orElse(null);
    }

    // =============================
    //   CREAR (recibe DTO)
    // =============================
    public Espacio create(EspacioDTO dto) {
        Espacio e = dto.toEntity();

        if (dto.getPrecioPorHora() != null) {
            e.setPrecioPorHora(BigDecimal.valueOf(dto.getPrecioPorHora()));
        } else if (e.getPrecioPorHora() == null) {
            e.setPrecioPorHora(BigDecimal.ZERO);
        }

        if (dto.getTipoEspacioId() != null) {
            TipoEspacio tipo = tipoEspacioRepository.findById(dto.getTipoEspacioId())
                    .orElse(null);
            e.setTipoEspacio(tipo);
        }

        return espacioRepository.save(e);
    }

    // =============================
    //   ACTUALIZAR (recibe DTO)
    // =============================
    public Espacio update(Long id, EspacioDTO dto) {
        return espacioRepository.findById(id).map(e -> {

            e.setNombre(dto.getNombre());
            e.setDescripcion(dto.getDescripcion());
            e.setUbicacion(dto.getUbicacion());
            e.setCapacidad(dto.getCapacidad());
            e.setActivo(dto.getActivo());
            e.setEquipamiento(dto.getEquipamiento());

            // imagenUrl: no guardar "" (por el CHECK de BD)
            String img = dto.getImagenUrl();
            if (img != null && !img.trim().isEmpty()) {
                e.setImagenUrl(img.trim());
            } else {
                e.setImagenUrl(null);
            }

            if (dto.getPrecioPorHora() != null) {
                e.setPrecioPorHora(BigDecimal.valueOf(dto.getPrecioPorHora()));
            }

            if (dto.getTipoEspacioId() != null) {
                TipoEspacio tipo = tipoEspacioRepository.findById(dto.getTipoEspacioId())
                        .orElse(null);
                e.setTipoEspacio(tipo);
            }

            return espacioRepository.save(e);

        }).orElse(null);
    }

    // =============================
    //   SOFT DELETE
    // =============================
    public void delete(Long id) {
        espacioRepository.findById(id).ifPresent(e -> {
            e.setActivo(false);
            espacioRepository.save(e);
        });
    }

    // =============================
    //   UPDATE SOLO imagenUrl
    // =============================
    public Espacio updateImagen(Long id, String imagenUrl) {
        return espacioRepository.findById(id).map(e -> {

            if (imagenUrl != null && !imagenUrl.trim().isEmpty()) {
                e.setImagenUrl(imagenUrl.trim());
            } else {
                e.setImagenUrl(null);
            }

            return espacioRepository.save(e);

        }).orElse(null);
    }
}
