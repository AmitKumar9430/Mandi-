package com.mandi.job;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SkillExchangeRepository extends JpaRepository<SkillExchange, Long> {
    List<SkillExchange> findByStatusOrderByCreatedAtDesc(String status);
}
