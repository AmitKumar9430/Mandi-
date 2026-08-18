package com.mandi.auth;

import com.mandi.auth.dto.AuthResponse;
import com.mandi.auth.dto.LoginRequest;
import com.mandi.auth.dto.RegisterRequest;
import com.mandi.exception.DuplicateResourceException;
import com.mandi.security.JwtUtils;
import com.mandi.user.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProfileRepository profileRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("Registration with unique phone should succeed, hash password, and return JWT")
    void testSuccessfulRegistration() {
        RegisterRequest req = new RegisterRequest();
        req.setPhone("9876500000");
        req.setFullName("Test Citizen");
        req.setPassword("Secret@123");
        req.setVillageOrTown("Malihabad");

        when(userRepository.existsByPhone(req.getPhone())).thenReturn(false);
        when(passwordEncoder.encode("Secret@123")).thenReturn("hashedPassword");

        User savedUser = new User(req.getPhone(), null, "hashedPassword", req.getFullName());
        savedUser.setId(101L);
        savedUser.setRoles(Set.of(Role.ROLE_CITIZEN));
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtUtils.generateToken(auth)).thenReturn("mock.jwt.token");

        AuthResponse resp = authService.register(req);

        assertNotNull(resp);
        assertEquals("mock.jwt.token", resp.getToken());
        assertEquals("Test Citizen", resp.getFullName());
        assertEquals("9876500000", resp.getPhone());
    }

    @Test
    @DisplayName("Registration with duplicate phone must throw DuplicateResourceException")
    void testDuplicatePhoneRegistration() {
        RegisterRequest req = new RegisterRequest();
        req.setPhone("9876500000");
        req.setFullName("Test Citizen");
        req.setPassword("Secret@123");

        when(userRepository.existsByPhone("9876500000")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(req));
    }
}
