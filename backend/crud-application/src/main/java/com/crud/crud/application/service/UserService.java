package com.crud.crud.application.service;
import com.crud.crud.application.model.Role;
import com.crud.crud.application.repository.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import com.crud.crud.application.model.User;
import com.crud.crud.application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final Logger logger = LoggerFactory.getLogger(UserService.class);

    public boolean saveNewUser(User user) {
        try {

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            Role role = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Role not found"));

            user.setRoles(Set.of(role));
            logger.info("Saving new user in userservice: {}", user.getUsername());
            userRepository.save(user);
            return true;
        } catch (Exception e) {
                log.error("Error saving new user: {}", e.getMessage());
            return false;
        }
    }

    public void saveAdmin(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Role roleUser = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Role roleAdmin = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setRoles(Set.of(roleUser,roleAdmin));
        userRepository.save(user);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    public User findByUserName(String userName) {
        return userRepository.findByUsername(userName);
    }

    public void updateUser(User user, Long id) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User updatedUser = existingUser.get();
            updatedUser.setUsername(user.getUsername());
            updatedUser.setName(user.getName());
            updatedUser.setEmail(user.getEmail());
            updatedUser.setRoles(user.getRoles());
            userRepository.save(updatedUser);
        } else {
            log.warn("User with id {} not found for update", id);
        }
    }
}