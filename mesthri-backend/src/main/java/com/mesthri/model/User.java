package com.mesthri.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true, length = 15)
    private String phone;

    @Column(nullable = false)
    private String password; // plain for now

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role; // CUSTOMER, MESTHRI/MESTRI, WORKER (your enum may say MESTHRI)

    private String location;

    @ElementCollection
    @CollectionTable(name = "user_skills", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    // NEW: optional availability window for simple date filtering
    private LocalDate availabilityStartDate; // nullable = “generally available”
    private LocalDate availabilityEndDate;   // nullable = “open-ended”

    // --- getters/setters ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public LocalDate getAvailabilityStartDate() { return availabilityStartDate; }
    public void setAvailabilityStartDate(LocalDate availabilityStartDate) { this.availabilityStartDate = availabilityStartDate; }

    public LocalDate getAvailabilityEndDate() { return availabilityEndDate; }
    public void setAvailabilityEndDate(LocalDate availabilityEndDate) { this.availabilityEndDate = availabilityEndDate; }
}
