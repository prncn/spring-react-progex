package com.example.backend.controller;

import com.example.backend.model.Post;
import com.example.backend.service.PostService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping(value = "/", produces = "application/json")
    public List<Post> getAllPost() throws ExecutionException, InterruptedException {
        return postService.getPostList();
    }

    @PostMapping(value = "/", produces = "application/json")
    public String createPost(@RequestBody Post post) throws ExecutionException, InterruptedException {
        return postService.createPost(post);
    }

    @PutMapping(value = "/", produces = "application/json")
    public String updatePost(@RequestBody Post post) throws ExecutionException, InterruptedException {
        return postService.updatePost(post);
    }

    @DeleteMapping(value = "/", produces = "application/json")
    public String deletePost(@RequestHeader String id) throws InterruptedException, ExecutionException {
        return postService.deletePost(id);
    }

}
