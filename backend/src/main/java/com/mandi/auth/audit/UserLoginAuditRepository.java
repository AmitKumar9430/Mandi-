package com.mandi.auth.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserLoginAuditRepository extends JpaRepository<UserLoginAudit, Long> {

    List<UserLoginAudit> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<UserLoginAudit> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<UserLoginAudit> findByIdentifierOrderByCreatedAtDesc(String identifier);

    long countByIpAddressAndCreatedAtAfter(String ipAddress, LocalDateTime since);
}
