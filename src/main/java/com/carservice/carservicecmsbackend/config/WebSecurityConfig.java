package com.carservice.carservicecmsbackend.config;


import com.carservice.carservicecmsbackend.model.UserRole;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
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
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests

                        .requestMatchers(HttpMethod.GET,
                                "/api/opinions",
                                "/api/opening-hours",
                                "/api/contact-information",
                                "/api/pages/visible/section",
                                "/api/posts",
                                "/api/photos/homepage",
                                "/api/photos",
                                "/api/photos/{id}",
                                "/api/users/me",
                                "/images/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.POST,
                                "/api/auth/signup",
                                "/api/auth/login"
                        ).permitAll()

                        // CUSTOMER
                        .requestMatchers(HttpMethod.POST,
                                "/api/opinions"
                        ).hasAuthority(UserRole.USER.name())

                        // ADMIN
                        .requestMatchers(HttpMethod.POST,
                                "/api/opening-hours",
                                "/api/opening-hours/{id}",
                                "/api/contact-information/create",
                                "/api/photos/homepage",
                                "/api/photos/homepage/{id}",
                                "/api/photos/upload",
                                "/api/photos/upload/{id}",
                                "/api/posts/new",
                                "/api/pages/create",
                                "/api/section/create"
                        ).hasAuthority(UserRole.ADMIN.name())

                        .requestMatchers(HttpMethod.PUT,
                                "/api/opening-hours",
                                "/api/opening-hours/{id}",
                                "/api/contact-information/update",
                                "/api/contact-information/update/{id}",
                                "/api/photos/replace/homepage",
                                "/api/photos/replace/homepage/{id}",
                                "/api/photos/upload",
                                "/api/posts/update",
                                "/api/posts/update/{id}",
                                "/api/pages/id/neworder",
                                "/api/pages/id/neworder/{id}",
                                "/api/pages/update",
                                "/api/pages/update/{id}",
                                "/api/section/id/neworder",
                                "/api/section/id/neworder/{id}",
                                "/api/section/update",
                                "/api/section/update/{id}"
                        ).hasAuthority(UserRole.ADMIN.name())

                        .requestMatchers(HttpMethod.DELETE,
                                "/api/opening-hours",
                                "/api/opening-hours/{id}",
                                "/api/contact-information",
                                "/api/contact-information/{id}",
                                "/api/photos",
                                "/api/photos/{id}",
                                "/api/opinions",
                                "/api/opinions/{id}",
                                "/api/posts",
                                "/api/posts/{id}",
                                "/api/pages",
                                "/api/pages/{id}",
                                "/api/section",
                                "/api/section/{id}"
                        ).hasAuthority(UserRole.ADMIN.name())

                        .requestMatchers(HttpMethod.GET,
                                "/api/pages/section",
                                "/api/pages/{id}"
                        ).hasAuthority(UserRole.ADMIN.name())

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/swagger-ui.html"
                        ).hasAuthority(UserRole.DEV.name())

                        .anyRequest().denyAll()
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

        configuration.setAllowedOrigins(List.of("http://localhost:8080","http://localhost:5174","http://localhost:5173" ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
