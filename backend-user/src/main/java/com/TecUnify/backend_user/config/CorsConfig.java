package com.TecUnify.backend_user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        //  Orígenes permitidos
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
        ));

        //  Métodos permitidos
        config.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        //  Headers permitidos
        config.setAllowedHeaders(Arrays.asList("*"));

        //  Headers expuestos (necesarios para CORS avanzado)
        config.setExposedHeaders(Arrays.asList("*"));

        //  Permitir credenciales
        config.setAllowCredentials(true);

        //  Para cachear preflight durante 1 hora
        config.setMaxAge(3600L);

        //  Registrar configuración
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
