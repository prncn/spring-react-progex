package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users/{userId}")
    public @ResponseBody User getUserById(@PathVariable(value = "userId") String userId)
            throws ExecutionException, InterruptedException {
        return userService.getUserById(userId);
    }

    @PutMapping(value = "/users")
    public String updateUser(@RequestBody User user) throws ExecutionException, InterruptedException {
        return userService.updateUser(user);
    }

    @DeleteMapping(value = "/users")
    public String deleteUser(@RequestBody String userId) throws ExecutionException, InterruptedException {
        return userService.deleteUser(userId);
    }
}
