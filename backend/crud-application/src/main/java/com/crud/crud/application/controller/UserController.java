package com.crud.crud.application.controller;

import com.crud.crud.application.exception.UserNotFoundException;
import com.crud.crud.application.model.Role;
import com.crud.crud.application.model.User;
import com.crud.crud.application.repository.UserRepository;
import com.crud.crud.application.service.CustomUserDetailsService;
import com.crud.crud.application.service.UserService;
import com.crud.crud.application.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private final CustomUserDetailsService userDetailsService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    private final Logger logger = LoggerFactory.getLogger(UserController.class);

    public UserController(UserService userService, CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
        this.userService = userService;
    }

    @PostMapping("/user")
    Boolean newUser(@RequestBody User newUser) {

        return userService.saveNewUser(newUser);
    }

    @GetMapping("/users")
    List<User> getAllUsers() {
        return userService.getAll();
    }

    @GetMapping("/user/{id}")
    Optional<User> getUserById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PutMapping("/user/updateUser/{id}")
    public ResponseEntity<?> updateUser(@RequestBody User newUser, @PathVariable Long id) {
        // will get the data when user is already authenticated
        logger.info("Request here /user/updateUser");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();

        logger.info("Authenticated user: {}", userName);
        //User userInDb = userService.findByUserName(userName);// getting nayan123

        Optional<User> userInDbWithId = userService.findById(id);

        if (userInDbWithId.isPresent()) {
            User userInDb = userInDbWithId.get();
            logger.info(" user on which activity happened: {}", userInDb.getUsername());
            userInDb.setUsername(newUser.getUsername());
            userInDb.setEmail(newUser.getEmail());
            userInDb.setName(newUser.getName());
            //  userInDb.setPassword(newUser.getPassword());
            userService.updateUser(userInDb, id);
        }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/user/delete/{id}")
    ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userService.findById(id).isPresent()) {
            throw new UserNotFoundException(id);
        }
        userService.deleteById(id);
        return ResponseEntity.ok("user with id " + id + " has been deleted successfully");


    }

    @GetMapping("/user/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        User user = userService.findByUserName(username);

        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("roles", user.getRoles().stream()
                .map(Role::getName)
                .toList());

        return ResponseEntity.ok(response);
    }

}


