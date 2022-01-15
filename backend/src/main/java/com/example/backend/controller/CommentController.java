package com.example.backend.controller;

import com.example.backend.model.Comment;
import com.example.backend.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService){
        this.commentService = commentService;
    }

    @GetMapping
    public List<Comment> getCommentsFromPost(@PathVariable String postId) throws ExecutionException, InterruptedException {
        return commentService.getCommentsFromPost(postId);
    }

    @PostMapping(value = "/posts/{id}/comments")
    public void createComment(@PathVariable String id, @RequestBody Comment comment) throws ExecutionException, InterruptedException {
        commentService.createComment(id, comment);
    }

    @DeleteMapping(value =  "/posts/{postId}/comments/{commentId}")
    public String deleteCommentById(@PathVariable String postId , @PathVariable String commentId) throws ExecutionException, InterruptedException {
        return commentService.deleteComment(postId, commentId);
    }
}
