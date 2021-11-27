package com.example.backend.service;

import com.example.backend.model.Post;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class PostService {

    private Firestore firestore;

    public PostService(Firestore firestore){
        this.firestore = firestore;
    }

    public List<Post> getPostList() throws ExecutionException, InterruptedException {
        //asynchronously retrieve all document
        ApiFuture<QuerySnapshot> future = firestore.collection("posts").get();
        // future.get() blocks on response
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Post> posts = new ArrayList<>();

        for (QueryDocumentSnapshot document : documents) {
            posts.add(document.toObject(Post.class));
        }

        return posts;
    }
}
