package com.mesthri.controller;

import com.mesthri.model.Role;
import com.mesthri.model.User;
import com.mesthri.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/directory")
@CrossOrigin(origins = "http://localhost:5173")
public class SearchController {

    private final UserRepository userRepository;

    public SearchController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET /api/directory?role=MESTRI&service=plumb&location=Hyd&fromDate=2025-08-10&toDate=2025-08-12
    @GetMapping
    public ResponseEntity<?> search(@RequestParam String role,
                                    @RequestParam(required = false) String service,
                                    @RequestParam(required = false) String location,
                                    @RequestParam(required = false) String fromDate,
                                    @RequestParam(required = false) String toDate) {
        Role r;
        try {
            r = parseRoleFlexible(role);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid role. Use MESTRI/MESTHRI or WORKER");
        }
        if (r == Role.CUSTOMER) {
            return ResponseEntity.badRequest().body("Role must be MESTRI/MESTHRI or WORKER");
        }

        LocalDate from = parseDate(fromDate);
        LocalDate to   = parseDate(toDate);

        List<User> results = userRepository.advancedSearch(
                r,
                emptyToNull(location),
                emptyToNull(service),
                from, to
        );

        List<Map<String, Object>> response = new ArrayList<>();
        for (User u : results) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", u.getId());
            item.put("name", u.getName());
            item.put("phone", u.getPhone());
            item.put("role", u.getRole().name());
            item.put("location", u.getLocation());
            item.put("skills", u.getSkills());
            item.put("availabilityStartDate", u.getAvailabilityStartDate());
            item.put("availabilityEndDate", u.getAvailabilityEndDate());
            response.add(item);
        }
        return ResponseEntity.ok(response);
    }

    // ---- helpers ----
    private static String emptyToNull(String s) { return (s == null || s.isBlank()) ? null : s.trim(); }

    private static LocalDate parseDate(String s) {
        if (s == null || s.isBlank()) return null;
        try { return LocalDate.parse(s.trim()); } // expects YYYY-MM-DD
        catch (Exception e) { return null; }
    }

    private static Role parseRoleFlexible(String roleStr) {
        if (roleStr == null) throw new IllegalArgumentException("role is required");
        String r = roleStr.trim().toUpperCase(Locale.ROOT);
        // Accept both spellings depending on your enum
        if (r.equals("MESTRI") || r.equals("MESTHRI")) r = "MESTHRI"; // map to your enum value
        return Role.valueOf(r);
    }
}
