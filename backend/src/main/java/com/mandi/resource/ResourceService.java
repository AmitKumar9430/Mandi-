package com.mandi.resource;

import com.mandi.common.PageResponse;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.resource.dto.CreateResourceRequest;
import com.mandi.resource.dto.ResourceDto;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public ResourceService(ResourceRepository resourceRepository, UserRepository userRepository) {
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ResourceDto createResource(Long ownerUserId, CreateResourceRequest request) {
        User owner = userRepository.findById(ownerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", ownerUserId));

        Resource resource = new Resource();
        resource.setOwner(owner);
        resource.setName(request.getName());
        resource.setCategory(request.getCategory());
        resource.setDescription(request.getDescription());
        resource.setLocationName(request.getLocationName());
        resource.setVillageOrTown(request.getVillageOrTown());
        resource.setDistrict(request.getDistrict());
        resource.setState(request.getState());
        resource.setLatitude(request.getLatitude() != null ? request.getLatitude() : 26.8467);
        resource.setLongitude(request.getLongitude() != null ? request.getLongitude() : 80.9462);
        resource.setTermsConditions(request.getTermsConditions());
        resource.setCapacityOrQuantity(request.getCapacityOrQuantity());
        resource.setCostPerUnit(request.getCostPerUnit() != null ? request.getCostPerUnit() : 0.0);
        resource.setCostUnit(request.getCostUnit() != null ? request.getCostUnit() : "free");
        resource.setContactPhone(request.getContactPhone() != null ? request.getContactPhone() : owner.getPhone());
        resource.setAvailable(true);
        resource.setVerified(owner.isVerified());

        Resource saved = resourceRepository.save(resource);
        return ResourceDto.from(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<ResourceDto> searchResources(ResourceCategory category, String search, Pageable pageable) {
        Page<Resource> page = resourceRepository.searchAvailableResources(category, search, pageable);
        List<ResourceDto> dtos = page.getContent().stream()
                .map(ResourceDto::from)
                .collect(Collectors.toList());

        return new PageResponse<>(dtos, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Transactional(readOnly = true)
    public ResourceDto getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource", id));
        return ResourceDto.from(resource);
    }

    @Transactional(readOnly = true)
    public List<ResourceDto> getMapResources() {
        return resourceRepository.findAvailableForMap().stream()
                .map(ResourceDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ResourceDto toggleAvailability(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource", id));
        resource.setAvailable(!resource.isAvailable());
        return ResourceDto.from(resourceRepository.save(resource));
    }
}
