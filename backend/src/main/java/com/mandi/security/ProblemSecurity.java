package com.mandi.security;

import com.mandi.problem.Problem;
import com.mandi.problem.ProblemRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("problemSecurity")
public class ProblemSecurity {

    private final ProblemRepository problemRepository;

    public ProblemSecurity(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    public boolean isOwnerOrAdmin(Long problemId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_MANDI_MITRA"))) {
            return true;
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return problemRepository.findById(problemId)
                .map(Problem::getUser)
                .map(user -> user.getId().equals(userPrincipal.getId()))
                .orElse(false);
    }
}
