package com.TecUnify.backend_user.dto;

import com.TecUnify.backend_user.model.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Role role;
    private Boolean active;
}
