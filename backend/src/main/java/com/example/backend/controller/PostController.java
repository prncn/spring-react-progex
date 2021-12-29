package com.example.backend.controller;

import com.example.backend.model.Post;
import com.example.backend.service.PostService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.Data;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping(value = "/posts")
    public List<Post> getAllPost(@RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String user)
            throws ExecutionException, InterruptedException {
        if (limit == null) {
            limit = 50;
        }

        if (!(user instanceof String)) {
            return postService.getPostList(limit);
        } else {
            return postService.getPostList(limit, user);
        }
    }

    @GetMapping(value = "/posts/{id}")
    public Post getPostById(@PathVariable String id) throws ExecutionException, InterruptedException {
        return postService.getPostById(id);
    }

    @PostMapping(value = "/posts")
    public String createPost(@RequestBody Post post) throws ExecutionException, InterruptedException {
        return postService.createPost(post);
    }

    @PutMapping(value = "/posts")
    public String updatePost(@RequestBody Post post) throws ExecutionException, InterruptedException {
        return postService.updatePost(post);
    }

    @DeleteMapping(value = "/posts")
    public String deletePost(@RequestHeader String id) throws InterruptedException, ExecutionException {
        return postService.deletePost(id);
    }

    @Data
    static class PostUserJoin {
        String postId;
        String userId;
    }

    @PostMapping(value = "/posts/{id}/like")
    public String likePost(@RequestBody PostUserJoin data) throws InterruptedException, ExecutionException {
        return postService.likePost(data.getPostId(), data.getUserId(), true);
    }

    @DeleteMapping(value = "/posts/{id}/like")
    public String unlikePost(@RequestBody PostUserJoin data)
            throws InterruptedException, ExecutionException {
        return postService.likePost(data.getPostId(), data.getUserId(), false);
    }
}
