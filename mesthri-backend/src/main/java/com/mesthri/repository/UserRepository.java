package com.mesthri.repository;

import com.mesthri.model.User;
import com.mesthri.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.*;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByPhone(String phone);
    boolean existsByPhone(String phone);

    // Flexible directory search with JOIN on skills and optional date overlap
    @Query("""
        SELECT DISTINCT u FROM User u
        LEFT JOIN u.skills s
        WHERE u.role = :role
          AND (:location IS NULL OR LOWER(u.location) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:service IS NULL OR LOWER(s) LIKE LOWER(CONCAT('%', :service, '%')))
          AND (
                (:fromDate IS NULL AND :toDate IS NULL)
             OR (u.availabilityStartDate IS NULL AND u.availabilityEndDate IS NULL)
             OR (
                    (:fromDate IS NULL OR u.availabilityEndDate   IS NULL OR u.availabilityEndDate   >= :fromDate)
                AND (:toDate   IS NULL OR u.availabilityStartDate IS NULL OR u.availabilityStartDate <= :toDate)
                )
          )
        ORDER BY u.name ASC
        """)
    List<User> advancedSearch(Role role,
                              String location,
                              String service,
                              LocalDate fromDate,
                              LocalDate toDate);
}
