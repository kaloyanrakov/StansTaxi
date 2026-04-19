package com.example.backend.controller;

import com.example.backend.persistence.repository.AppSettingRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(originPatterns = "http://localhost:*", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AppSettingRepository appSettingRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(AppSettingRepository appSettingRepository) {
        this.appSettingRepository = appSettingRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body,
                                   HttpServletRequest request) {
        String password = body.get("password");

        String hash = appSettingRepository.findById("admin_password_hash")
                .map(s -> s.getSettingValue())
                .orElse(null);

        if (hash != null && passwordEncoder.matches(password, hash)) {
            HttpSession session = request.getSession(true);
            session.setAttribute("isLoggedIn", true);
            return ResponseEntity.ok(Map.of("success", true));
        }

        return ResponseEntity.status(401).body(Map.of("success", false, "error", "Wrong password"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/check-session")
    public ResponseEntity<Map<String, Boolean>> checkSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        boolean isAuthenticated = session != null
                && Boolean.TRUE.equals(session.getAttribute("isLoggedIn"));
        return ResponseEntity.ok(Map.of("isAuthenticated", isAuthenticated));
    }
}