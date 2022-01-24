package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.service.UserService;
import com.google.gson.Gson;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
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

    @GetMapping("/users")
    public @ResponseBody List<User> getUserList()
            throws ExecutionException, InterruptedException {
        return userService.getUserList();
    }

    @SuppressWarnings("unchecked")
    @PutMapping(value = "/users/{userId}")
    public String updateUser(@PathVariable(value = "userId") String userId, @RequestBody String updateString)
            throws ExecutionException, InterruptedException {
        HashMap<String, Object> updateData = new Gson().fromJson(updateString, HashMap.class);
        return userService.updateUser(userId, updateData);
    }

    @DeleteMapping(value = "/users/{userId}")
    public String deleteUser(@PathVariable(value = "userId") String userId)
            throws ExecutionException, InterruptedException {
        return userService.deleteUser(userId);
    }
}
