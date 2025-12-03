package com.TecUnify.backend_user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // 🔥 NECESARIO PARA QUE CORS FUNCIONE EN SPRING SECURITY
                .cors(Customizer.withDefaults())

                // Desactivar CSRF para APIs
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // OPCIONES son necesarias para preflight CORS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Permitir acceso libre a login
                        .requestMatchers("/api/auth/**").permitAll()

                        // Permitir chat IA
                        .requestMatchers("/api/tecla/**").permitAll()

                        // TODO: poner authenticated() cuando uses JWT
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}
