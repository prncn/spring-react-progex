package com.example.backend.controller;

import com.example.backend.model.Post;
import com.example.backend.service.PostService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService){
        this.postService = postService;
    }

    @GetMapping(value = "/" , produces = "application/json")
    public List<Post> getAllPost() throws ExecutionException, InterruptedException {
        return postService.getPostList();
    }
}
