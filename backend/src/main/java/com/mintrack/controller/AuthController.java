package com.mintrack.controller;

import com.mintrack.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    // Utilisateurs en mémoire (à remplacer par une table User en DB)
    private static final Map<String, String[]> USERS = new HashMap<>() {{
        put("admin",    new String[]{"$2b$12$uUJBjSwvi9xppIz13p1XGupdCr44W0SmSxbAJH9YgwdYNo3DJ.kFK", "ADMIN"});
        put("chef",     new String[]{"$2b$12$uUJBjSwvi9xppIz13p1XGupdCr44W0SmSxbAJH9YgwdYNo3DJ.kFK", "CHEF_EQUIPE"});
        put("ouvrier",  new String[]{"$2b$12$uUJBjSwvi9xppIz13p1XGupdCr44W0SmSxbAJH9YgwdYNo3DJ.kFK", "OUVRIER"});
    }};
    // Mot de passe pour tous : "password123"

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username et password requis"));
        }

        String[] userInfo = USERS.get(username);
        if (userInfo == null || !passwordEncoder.matches(password, userInfo[0])) {
            return ResponseEntity.status(401).body(Map.of("error", "Identifiants invalides"));
        }

        String token = jwtUtils.generateToken(username, userInfo[1]);
        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", username,
                "role", userInfo[1]
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Token manquant"));
        }
        String token = authHeader.substring(7);
        String username = jwtUtils.getUsernameFromToken(token);
        return ResponseEntity.ok(Map.of("username", username));
    }
}
