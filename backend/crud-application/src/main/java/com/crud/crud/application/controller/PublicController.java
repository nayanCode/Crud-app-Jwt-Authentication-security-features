package com.crud.crud.application.controller;

import com.crud.crud.application.model.User;
import com.crud.crud.application.repository.UserRepository;
import com.crud.crud.application.service.CustomUserDetailsService;
import com.crud.crud.application.service.UserService;
import com.crud.crud.application.utils.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/public")
@CrossOrigin("http://localhost:3000")
public class PublicController {
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

    private final Logger logger = LoggerFactory.getLogger(PublicController.class);

    public PublicController(UserService userService,CustomUserDetailsService userDetailsService) {
        this.userDetailsService=userDetailsService;
        this.userService = userService;
    }

    @GetMapping("/health-check")
    public String healthCheck() {
        logger.info("Health is ok !");
        return "Ok";
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user, HttpServletResponse response) {
        try {
            // will call userDetailsService internally to check user is present in DB or not
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

            //user is present in DB and authenticated succesfully
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());

            logger.info("Authenticated user during login: {}", user.getUsername());
            //get userDetails object which has properties like (username,password,roles)
            String jwt = jwtUtil.generateToken(userDetails.getUsername());
            ResponseCookie cookie = ResponseCookie.from("token", jwt)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(60 * 60)
                    .build();

            response.addHeader("Set-Cookie", cookie.toString());
            //geenerated jwt token
            return new ResponseEntity<>(jwt, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Exception occurred while createAuthenticationToken ", e);
            return new ResponseEntity<>("Incorrect username or password", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/signup")
    Boolean newUser(@RequestBody User newUser) {
        return userService.saveNewUser(newUser);
    }
}
