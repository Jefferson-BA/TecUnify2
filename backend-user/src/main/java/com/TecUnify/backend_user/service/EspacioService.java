package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.dto.EspacioDTO;
import com.TecUnify.backend_user.model.Espacio;
import com.TecUnify.backend_user.model.TipoEspacio;
import com .TecUnify.backend_user.repository.EspacioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EspacioService {
    private final EspacioRepository espacioRepository;

    public List<EspacioDTO> getAllEspacios() {
        return espacioRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EspacioDTO getEspacioById(Long id) {
        return espacioRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado"));
    }

    public List<EspacioDTO> getEspaciosByTipo(TipoEspacio tipo) {
        return espacioRepository.findByTipo(tipo).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EspacioDTO> getEspaciosDisponibles() {
        return espacioRepository.findByDisponibleTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EspacioDTO createEspacio(Espacio espacio) {
        Espacio savedEspacio = espacioRepository.save(espacio);
        return convertToDTO(savedEspacio);
    }

    public EspacioDTO updateEspacio(Long id, Espacio espacioDetails) {
        Espacio espacio = espacioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado"));

        espacio.setNombre(espacioDetails.getNombre());
        espacio.setDescripcion(espacioDetails.getDescripcion());
        espacio.setCapacidad(espacioDetails.getCapacidad());
        espacio.setPrecioHora(espacioDetails.getPrecioHora());
        espacio.setUbicacion(espacioDetails.getUbicacion());
        espacio.setDisponible(espacioDetails.getDisponible());

        Espacio updatedEspacio = espacioRepository.save(espacio);
        return convertToDTO(updatedEspacio);
    }

    private EspacioDTO convertToDTO(Espacio espacio) {
        return EspacioDTO.builder()
                .id(espacio.getId())
                .nombre(espacio.getNombre())
                .descripcion(espacio.getDescripcion())
                .tipo(espacio.getTipo())
                .capacidad(espacio.getCapacidad())
                .precioHora(espacio.getPrecioHora())
                .ubicacion(espacio.getUbicacion())
                .disponible(espacio.getDisponible())
                .build();
    }
}
