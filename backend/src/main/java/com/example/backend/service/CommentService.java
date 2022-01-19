package com.example.backend.service;

import com.example.backend.model.Comment;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class CommentService {
    private Firestore firestore;

    public CommentService(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<Comment> getCommentsFromPost(String postId) throws ExecutionException, InterruptedException {
        Query commentsQuery = firestore
                .collection("posts")
                .document(postId)
                .collection("comments")
                .orderBy("date", Query.Direction.DESCENDING);

        ApiFuture<QuerySnapshot> future = commentsQuery.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Comment> comments = new ArrayList<>();

        for (QueryDocumentSnapshot document : documents) {
            DocumentReference documentReference = (DocumentReference) document.get("userId");
            ApiFuture<DocumentSnapshot> userFuture = documentReference.get();
            DocumentSnapshot userDoc = userFuture.get();

            Comment comment = new Comment();

            comment.setId(document.getId());
            comment.setDescription(document.getString("description"));
            comment.setDate(document.getTimestamp("date"));
            if (userDoc.exists()) {
                UserService userService = new UserService(firestore);
                comment.setUser(userService.getUserById(documentReference.getId()));
            }

            comments.add(comment);
        }

        return comments;
    }

    /**
     * Creates a comment under a post.
     * @param id id of the post that should be commented
     * @param comment content of comment
     * @return time it took to post
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public void createComment(String id, Comment comment) throws ExecutionException, InterruptedException {
        comment.setDate(Timestamp.now());

        String userId = comment.getUser().getId();
        DocumentReference userRef = firestore.collection("users").document(userId);

        Map<String, Object> commentData = new HashMap<>();
        commentData.put("date", Timestamp.now());
        commentData.put("description", comment.getDescription());
        commentData.put("userId", userRef);

        firestore.collection("posts")
                .document(id)
                .collection("comments")
                .add(commentData);
    }

    public String deleteComment(String postId, String commentId) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> writeResult =
                firestore.collection("posts")
                        .document(postId)
                        .collection("comments")
                        .document(commentId).delete();
        return writeResult.get().getUpdateTime().toString();
    }

}
