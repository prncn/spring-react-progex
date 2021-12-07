package com.example.backend.service;

import com.example.backend.model.Post;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;


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

    public String createPost(Post post) throws InterruptedException, ExecutionException
    {
      post.setDate(Timestamp.now()); //get local current time
      Firestore dbFirestore = FirestoreClient.getFirestore();
      ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("posts").document().set(post);
      return collectionsApiFuture.get().getUpdateTime().toString(); 

    }

    /**
     * Updates post with new post information with parameter post
     * @param post post to be updated
     * @return date and time of update
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public String updatePost(Post post) throws ExecutionException, InterruptedException
    {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("posts").document(post.getId()).set(post);
        return collectionsApiFuture.get().getUpdateTime().toString();

    }
}
