package com.mesthri.controller;

import com.mesthri.model.User;
import com.mesthri.model.Role;
import com.mesthri.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    public AuthController(UserRepository userRepository) { this.userRepository = userRepository; }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        String phone = str(body.get("phone"));
        String password = str(body.get("password"));
        String name = str(body.get("name"));
        String roleStr = str(body.get("role"));
        String location = str(body.get("location"));

        if (isBlank(phone) || isBlank(password) || isBlank(name) || isBlank(roleStr)) {
            return ResponseEntity.badRequest().body("phone, password, name, role are required");
        }
        if (userRepository.existsByPhone(phone)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Phone number already exists");
        }

        Role role;
        try { role = parseRoleFlexible(roleStr); }
        catch (Exception e) { return ResponseEntity.badRequest().body("Invalid role. Use CUSTOMER, MESTRI/MESTHRI, or WORKER"); }

        User user = new User();
        user.setPhone(phone.trim());
        user.setPassword(password); // plain for now
        user.setName(name.trim());
        user.setRole(role);
        if (!isBlank(location)) user.setLocation(location.trim());

        // skills: array OR comma-separated string
        Object skillsObj = body.get("skills");
        if (skillsObj instanceof List<?> list) {
            List<String> skills = new ArrayList<>();
            for (Object o : list) if (o != null && !o.toString().isBlank()) skills.add(o.toString().trim());
            user.setSkills(skills);
        } else if (skillsObj instanceof String s && !s.isBlank()) {
            List<String> skills = new ArrayList<>();
            for (String part : s.split(",")) if (part != null && !part.isBlank()) skills.add(part.trim());
            user.setSkills(skills);
        }

        userRepository.save(user);
        return ResponseEntity.ok("Registration successful!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String phone = str(body.get("phone"));
        String password = str(body.get("password"));
        if (isBlank(phone) || isBlank(password)) return ResponseEntity.badRequest().body("phone and password are required");

        Optional<User> opt = userRepository.findByPhone(phone.trim());
        if (opt.isEmpty() || !password.equals(opt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid phone number or password!");
        }
        User u = opt.get();
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("message", "Login successful");
        resp.put("userId", u.getId());
        resp.put("role", u.getRole().name());
        resp.put("name", u.getName());
        resp.put("phone", u.getPhone());
        resp.put("location", u.getLocation());
        resp.put("skills", u.getSkills());
        return ResponseEntity.ok(resp);
    }

    // --- helpers ---
    private static String str(Object o) { return o == null ? null : String.valueOf(o); }
    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }

    private static Role parseRoleFlexible(String roleStr) {
        if (roleStr == null) throw new IllegalArgumentException("role is required");
        String r = roleStr.trim().toUpperCase(Locale.ROOT);
        if (r.equals("MESTRI") || r.equals("MESTHRI")) r = "MESTHRI"; // map both to your enum value
        return Role.valueOf(r);
    }
}
