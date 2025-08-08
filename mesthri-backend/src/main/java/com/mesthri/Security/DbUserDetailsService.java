package com.mesthri.security;

import com.mesthri.model.User;
import com.mesthri.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;

import java.util.List;

public class DbUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public DbUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String phone) throws UsernameNotFoundException {
        User u = userRepository.findByPhone(phone)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // map your Role enum to a Spring authority (e.g., ROLE_MESTRI)
        String roleName = "ROLE_" + u.getRole().name(); // e.g. ROLE_MESTHRI or ROLE_MESTRI
        List<GrantedAuthority> auths = List.of(new SimpleGrantedAuthority(roleName));

        // username = phone, password = your stored password (plain-text for MVP)
        return org.springframework.security.core.userdetails.User
                .withUsername(u.getPhone())
                .password("{noop}" + u.getPassword()) // {noop} = no encoding (MVP only)
                .authorities(auths)
                .accountExpired(false).accountLocked(false).credentialsExpired(false).disabled(false)
                .build();
    }
}
