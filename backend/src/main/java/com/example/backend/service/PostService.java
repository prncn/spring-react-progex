package com.example.backend.service;

import com.example.backend.model.Post;
import com.example.backend.model.PostDocument;
import com.example.backend.model.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class PostService {

    private Firestore firestore;

    public PostService(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<Post> getPostList() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection("posts").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Post> posts = new ArrayList<>();

        for (QueryDocumentSnapshot document : documents) {
            Post post = new Post();

            post.setId(document.getId());
            post.setTitle(document.getString("title"));
            post.setDescription(document.getString("description"));
            post.setDate(document.getTimestamp("date"));
            post.setUrl(document.getString("url"));

            DocumentReference ds = (DocumentReference) document.get("userId");
            ApiFuture<DocumentSnapshot> userFuture = ds.get();
            DocumentSnapshot userDoc = userFuture.get();
            User user = new User();
            user.setDisplayName(userDoc.getString("displayName"));
            user.setEmail(userDoc.getString("email"));
            user.setPhotoURL(userDoc.getString("photoURL"));

            post.setUser(user);

            posts.add(post);
        }

        return posts;
    }

    public String createPost(Post post) throws InterruptedException, ExecutionException {
        post.setDate(Timestamp.now()); // get local current time
        firestore = FirestoreClient.getFirestore();
        String userId = post.getUser().getId();
        System.out.println(userId);
        DocumentReference userRef = firestore.collection("users").document(userId);
        PostDocument postDoc = new PostDocument(post, userRef);

        ApiFuture<WriteResult> collectionsApiFuture = firestore.collection("posts").document().set(postDoc);
        return collectionsApiFuture.get().getUpdateTime().toString();

    }

    /**
     * Updates post with new post information with parameter post
     * 
     * @param post post to be updated
     * @return date and time of update
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public String updatePost(Post post) throws ExecutionException, InterruptedException {
        firestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = firestore.collection("posts").document(post.getId()).set(post);
        return collectionsApiFuture.get().getUpdateTime().toString();

    }

    public String deletePost(String id) throws InterruptedException, ExecutionException {
        firestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = firestore.collection("posts").document(id).delete();
        return writeResult.get().getUpdateTime().toString();
    }
}
