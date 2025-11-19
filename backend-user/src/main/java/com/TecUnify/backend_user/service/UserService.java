package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.dto.UserDTO;
import com.TecUnify.backend_user.model.User;
import com.TecUnify.backend_user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService {
    @org.springframework.beans.factory.annotation.Autowired
    private com.TecUnify.backend_user.repository.ReservaRepository reservaRepository;

    // Obtener Perfil Completo con Estadísticas
    public com.TecUnify.backend_user.dto.UserProfileDTO getUserProfile(String email) {
        User user = findByEmail(email);
        if (user == null)
            return null;

        // Obtener todas las reservas del usuario
        java.util.List<com.TecUnify.backend_user.model.Reserva> reservas = reservaRepository
                .findByUsuarioId(user.getId());

        int total = reservas.size();
        int activas = (int) reservas.stream()
                .filter(r -> r.getEstado() == com.TecUnify.backend_user.model.EstadoReserva.PENDIENTE ||
                        r.getEstado() == com.TecUnify.backend_user.model.EstadoReserva.CONFIRMADA)
                .count();

        // Construir DTO
        return com.TecUnify.backend_user.dto.UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .totalReservas(total)
                .reservasActivas(activas)
                .horasReservadas(total * 2) // Estimado: 2 horas por reserva promedio
                .build();
    }

    // Actualizar solo datos de perfil (Teléfono, Nombre)
    public UserDTO updateProfile(String email, com.TecUnify.backend_user.dto.UserProfileDTO dto) {
        User user = findByEmail(email);
        if (user == null)
            return null;

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());

        return com.TecUnify.backend_user.dto.UserDTO.fromEntity(userRepository.save(user));
    }

    private final UserRepository userRepository;

    // ==========================
    // AUTH GOOGLE (ya tenías)
    // ==========================
    public User findOrCreateGoogleUser(String googleId, String email, String firstName, String lastName) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            if (user.getGoogleId() == null || user.getGoogleId().isEmpty()) {
                user.setGoogleId(googleId);
                userRepository.save(user);
            }
            return user;
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setGoogleId(googleId);
        newUser.setFirstName(firstName != null ? firstName : "");
        newUser.setLastName(lastName != null ? lastName : "");
        newUser.setRole(com.TecUnify.backend_user.model.Role.USER);
        newUser.setActive(true);

        return userRepository.save(newUser);
    }

    // ==========================
    // CRUD PARA UserController
    // ==========================

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserDTO::fromEntity)
                .orElse(null);
    }

    public UserDTO updateUser(Long id, User details) {

        return userRepository.findById(id).map(user -> {
            // Actualizar datos permitidos
            user.setFirstName(details.getFirstName());
            user.setLastName(details.getLastName());
            user.setPhone(details.getPhone());
            user.setActive(details.getActive());
            user.setRole(details.getRole());

            return UserDTO.fromEntity(userRepository.save(user));
        }).orElse(null);
    }

    public void deleteUser(Long id) {
        userRepository.findById(id).ifPresent(userRepository::delete);
    }

    // ==========================
    // Extras
    // ==========================

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
