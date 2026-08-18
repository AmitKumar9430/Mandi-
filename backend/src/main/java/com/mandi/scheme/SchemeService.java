package com.mandi.scheme;

import com.mandi.common.PageResponse;
import com.mandi.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchemeService {
    private final GovernmentSchemeRepository schemeRepository;

    public SchemeService(GovernmentSchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<SchemeDto> searchSchemes(String category, String search, Pageable pageable) {
        Page<GovernmentScheme> page = schemeRepository.searchSchemes(category, search, pageable);
        List<SchemeDto> dtos = page.getContent().stream().map(SchemeDto::from).collect(Collectors.toList());
        return new PageResponse<>(dtos, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Transactional(readOnly = true)
    public SchemeDto getSchemeById(Long id) {
        GovernmentScheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GovernmentScheme", id));
        return SchemeDto.from(scheme);
    }
}
