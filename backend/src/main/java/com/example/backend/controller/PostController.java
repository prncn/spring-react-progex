package com.example.backend.controller;

import com.example.backend.model.Post;
import com.example.backend.model.User;
import com.example.backend.service.PostService;
import org.springframework.web.bind.annotation.*;

import lombok.Data;

import java.util.List;
import java.util.Map;
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
            @RequestParam(required = false) String user, @RequestParam(value = "category", required = false) String category)
            throws ExecutionException, InterruptedException {
        if (limit == null) {
            limit = 50;
        }

        if (user instanceof String) {
            //Get all posts from user
            return postService.getPostList(limit, user);
        } else if (category instanceof String){
            return postService.getPostsFromCategory(category, limit);
        } else{
            return postService.getPostList(limit);
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

    @DeleteMapping(value = "/posts/{id}")
    public String deletePost(@PathVariable String id, @RequestBody Post post) throws InterruptedException, ExecutionException {
        return postService.deletePost(id, post.getCategory());
    }

    @Data
    static class PostUserJoin {
        String postId;
        String userId;
    }

    @PostMapping(value = "/posts/{id}/like")
    public String likePost(@RequestBody PostUserJoin data) throws InterruptedException, ExecutionException, IllegalAccessException {
        return postService.incrementPost("likedPosts", data.getPostId(), data.getUserId(), true);
    }

    @DeleteMapping(value = "/posts/{id}/like")
    public String unlikePost(@RequestBody PostUserJoin data)
            throws InterruptedException, ExecutionException, IllegalAccessException {
        return postService.incrementPost("likedPosts", data.getPostId(), data.getUserId(), false);
    }

    @PostMapping(value = "/posts/{id}/save")
    public String savePost(@RequestBody PostUserJoin data) throws InterruptedException, ExecutionException, IllegalAccessException {
        return postService.incrementPost("savedPosts", data.getPostId(), data.getUserId(), true);
    }

    @DeleteMapping(value = "/posts/{id}/save")
    public String unsavePost(@RequestBody PostUserJoin data)
            throws InterruptedException, ExecutionException, IllegalAccessException {
        return postService.incrementPost("savedPosts", data.getPostId(), data.getUserId(), false);
    }

    @GetMapping(value = "/categories")
    public Map<String, Integer> getCategories() throws ExecutionException, InterruptedException {
        return postService.getCategories();
    }
}
