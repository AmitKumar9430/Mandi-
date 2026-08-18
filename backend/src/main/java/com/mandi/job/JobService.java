package com.mandi.job;

import com.mandi.common.PageResponse;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.job.dto.JobDtos.*;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobPostingRepository jobPostingRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final TimeBankRepository timeBankRepository;
    private final SkillExchangeRepository skillExchangeRepository;
    private final UserRepository userRepository;

    public JobService(
            JobPostingRepository jobPostingRepository,
            WorkerProfileRepository workerProfileRepository,
            TimeBankRepository timeBankRepository,
            SkillExchangeRepository skillExchangeRepository,
            UserRepository userRepository) {
        this.jobPostingRepository = jobPostingRepository;
        this.workerProfileRepository = workerProfileRepository;
        this.timeBankRepository = timeBankRepository;
        this.skillExchangeRepository = skillExchangeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public JobPostingDto createJob(Long employerUserId, CreateJobRequest request) {
        User employer = userRepository.findById(employerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", employerUserId));

        JobPosting job = new JobPosting();
        job.setEmployer(employer);
        job.setTitle(request.getTitle());
        job.setSkillCategory(request.getSkillCategory());
        job.setDescription(request.getDescription());
        job.setCompensationAmount(request.getCompensationAmount());
        job.setCompensationType(request.getCompensationType() != null ? request.getCompensationType() : "DAILY");
        job.setDurationDays(request.getDurationDays());
        job.setLocationName(request.getLocationName());
        job.setVillageOrTown(request.getVillageOrTown());
        job.setDistrict(request.getDistrict());
        job.setLatitude(request.getLatitude() != null ? request.getLatitude() : 26.8467);
        job.setLongitude(request.getLongitude() != null ? request.getLongitude() : 80.9462);
        job.setContactPhone(request.getContactPhone() != null ? request.getContactPhone() : employer.getPhone());
        job.setStatus("OPEN");

        JobPosting saved = jobPostingRepository.save(job);
        return JobPostingDto.from(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<JobPostingDto> searchJobs(String skillCategory, String search, Pageable pageable) {
        Page<JobPosting> page = jobPostingRepository.searchOpenJobs(skillCategory, search, pageable);
        List<JobPostingDto> dtos = page.getContent().stream().map(JobPostingDto::from).collect(Collectors.toList());
        return new PageResponse<>(dtos, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Transactional(readOnly = true)
    public List<JobPostingDto> getEmployerJobs(Long employerUserId) {
        return jobPostingRepository.findByEmployerIdOrderByCreatedAtDesc(employerUserId).stream()
                .map(JobPostingDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public TimeBankDto registerTimeBank(Long userId, String skillOffered, Double hoursPerWeek, String schedule, String description) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        TimeBankEntry entry = new TimeBankEntry();
        entry.setUser(user);
        entry.setSkillOffered(skillOffered);
        entry.setHoursAvailablePerWeek(hoursPerWeek != null ? hoursPerWeek : 2.0);
        entry.setAvailabilitySchedule(schedule);
        entry.setDescription(description);
        entry.setActive(true);

        return TimeBankDto.from(timeBankRepository.save(entry));
    }

    @Transactional(readOnly = true)
    public List<TimeBankDto> getTimeBankVolunteers() {
        return timeBankRepository.findByActiveTrueOrderByCreatedAtDesc().stream()
                .map(TimeBankDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillExchangeDto postSkillExchange(Long userId, String skillOffered, String skillNeeded, String terms) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        SkillExchange se = new SkillExchange();
        se.setUser(user);
        se.setSkillOffered(skillOffered);
        se.setSkillNeeded(skillNeeded);
        se.setTerms(terms);
        se.setStatus("OPEN");

        return SkillExchangeDto.from(skillExchangeRepository.save(se));
    }

    @Transactional(readOnly = true)
    public List<SkillExchangeDto> getSkillExchanges() {
        return skillExchangeRepository.findByStatusOrderByCreatedAtDesc("OPEN").stream()
                .map(SkillExchangeDto::from)
                .collect(Collectors.toList());
    }
}
