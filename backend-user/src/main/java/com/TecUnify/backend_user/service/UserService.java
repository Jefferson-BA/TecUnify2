package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.dto.UserDTO;
import com.TecUnify.backend_user.model.User;
import com.TecUnify.backend_user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;

    /**
     * Busca un usuario por ID y lo mapea a un DTO.
     * @param id El ID del usuario.
     * @return El DTO del usuario encontrado.
     * @throws RuntimeException si el usuario no es encontrado.
     */
    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    /**
     * Busca un usuario por email y lo mapea a un DTO.
     * @param email El correo electrónico del usuario.
     * @return El DTO del usuario encontrado.
     * @throws RuntimeException si el usuario no es encontrado.
     */
    public UserDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    /**
     * Obtiene todos los usuarios y los devuelve como una lista de DTOs.
     * @return Una lista de UserDTO.
     */
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crea un nuevo usuario, guardando la contraseña directamente (sin cifrado).
     * NOTA: Guardar contraseñas sin cifrar no es seguro en producción.
     * @param user El objeto User con los detalles del nuevo usuario.
     * @return El DTO del usuario guardado.
     * @throws RuntimeException si el email ya está registrado.
     */
    public UserDTO createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Se guarda la contraseña tal como viene (SIN CIFRAR)
        // user.setPassword(passwordEncoder.encode(user.getPassword())); // Se elimina la codificación
        
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    /**
     * Actualiza la información básica de un usuario existente.
     * NOTA: Este método no actualiza la contraseña.
     * @param id El ID del usuario a actualizar.
     * @param userDetails Los nuevos detalles del usuario.
     * @return El DTO del usuario actualizado.
     * @throws RuntimeException si el usuario no es encontrado.
     */
    public UserDTO updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setPhone(userDetails.getPhone());

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    /**
     * Elimina un usuario por su ID.
     * @param id El ID del usuario a eliminar.
     */
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Convierte la entidad User a un DTO (Data Transfer Object).
     * @param user La entidad User.
     * @return El UserDTO.
     */
    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole())
                .active(user.getActive())
                .build();
    }
}
