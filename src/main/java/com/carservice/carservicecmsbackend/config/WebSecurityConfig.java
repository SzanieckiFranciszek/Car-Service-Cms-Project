package com.carservice.carservicecmsbackend.config;


import com.carservice.carservicecmsbackend.model.UserRole;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import java.util.List;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public WebSecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers("/api/auth/**",
                                "/api/contact-information",
                                "/api/contact-information/{id}",
                                "/api/contact-information/phone",
                                "/api/contact-information/email",
                                "/api/contact-information/description/{description}",
                                "/api/homepage",
                                "/api/opening-hours",
                                "/api/opening-hours/{id}",
                                "/api/opinions",
                                "/api/opinions/{id}",
                                "/api/pages",
                                "/api/pages/section",
                                "/api/pages/details",
                                "/api/pages/visible",
                                "/api/pages/visible/section",
                                "/api/pages/visible/details",
                                "/api/pages/{id}",
                                "/api/photos",
                                "/api/photos/{id}",
                                "/api/photos/download/{id}",
                                "/api/photos/homepage",
                                "/api/posts",
                                "/api/posts/basic/{id}",
                                "/api/posts/{id}",
                                "/api/section",
                                "/api/section/{id}"
                                ).permitAll()
                                .requestMatchers("/swagger-ui/**","/v3/api-docs/**",
                                        "/swagger-resources/**",
                                        "/swagger-ui.html","/api/users/me").hasAuthority(UserRole.DEV.name())
                                .requestMatchers("/api/users","/api/users/{id}","/api/users/me").hasAuthority(UserRole.ADMIN.name())
                                .requestMatchers("/api/users/me").hasAnyAuthority(UserRole.USER.name())
                        .anyRequest().authenticated()
//
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:8080"));
        configuration.setAllowedMethods(List.of("GET", "POST"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
