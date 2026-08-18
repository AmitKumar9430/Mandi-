package com.mandi.job;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TimeBankRepository extends JpaRepository<TimeBankEntry, Long> {
    List<TimeBankEntry> findByActiveTrueOrderByCreatedAtDesc();
    List<TimeBankEntry> findByUserIdOrderByCreatedAtDesc(Long userId);
}
