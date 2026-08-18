package com.mandi.scheme;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GovernmentSchemeRepository extends JpaRepository<GovernmentScheme, Long> {

    @Query("SELECT s FROM GovernmentScheme s WHERE " +
            "(:category IS NULL OR s.category = :category) AND " +
            "(:search IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(s.benefits) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<GovernmentScheme> searchSchemes(@Param("category") String category, @Param("search") String search, Pageable pageable);

    List<GovernmentScheme> findByCategory(String category);
}
