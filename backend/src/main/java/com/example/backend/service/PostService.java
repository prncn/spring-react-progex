package com.example.backend.service;

import com.example.backend.model.Post;
import com.example.backend.model.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.cloud.firestore.Query.Direction;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class PostService {

    private Firestore firestore;

    public PostService(Firestore firestore) {
        this.firestore = firestore;
    }

    /**
     * Retrieve list of posts
     * 
     * @param limit
     * @return
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public List<Post> getPostList(int limit, String byUser) throws ExecutionException, InterruptedException {
        DocumentReference userRef = firestore.collection("users").document(byUser);
        Query postsCollection = firestore.collection("posts")
                .orderBy("date", Direction.DESCENDING)
                .limit(limit)
                .whereEqualTo("userId", userRef);

        ApiFuture<QuerySnapshot> future = postsCollection.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Post> posts = new ArrayList<>();

        for (QueryDocumentSnapshot document : documents) {
            String id = document.getId();
            Post post = getPostById(id);
            posts.add(post);
        }

        return posts;
    }

    public List<Post> getPostList(int limit) throws ExecutionException, InterruptedException {
        Query postsCollection = firestore.collection("posts")
                .orderBy("date", Direction.DESCENDING)
                .limit(limit);

        ApiFuture<QuerySnapshot> future = postsCollection.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Post> posts = new ArrayList<>();

        for (QueryDocumentSnapshot document : documents) {
            String id = document.getId();
            Post post = getPostById(id);
            posts.add(post);
        }

        return posts;
    }

    /**
     * Create psot
     * 
     * @param post
     * @return
     * @throws InterruptedException
     * @throws ExecutionException
     */
    public String createPost(Post post) throws InterruptedException, ExecutionException {
        post.setDate(Timestamp.now()); // get local current time

        String userId = post.getUser().getId();
        DocumentReference userRef = firestore.collection("users").document(userId);
        Map<String, Object> postData = new HashMap<>();
        postData.put("date", post.getDate());
        postData.put("description", post.getDescription());
        postData.put("likedCount", post.getLikeCount());
        postData.put("title", post.getTitle());
        postData.put("url", post.getUrl());
        postData.put("userId", userRef);

        ApiFuture<WriteResult> collectionsApiFuture = firestore.collection("posts").document().set(postData);
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
        ApiFuture<WriteResult> collectionsApiFuture = firestore.collection("posts").document(post.getId()).set(post);
        return collectionsApiFuture.get().getUpdateTime().toString();
    }

    public String deletePost(String id) throws InterruptedException, ExecutionException {
        ApiFuture<WriteResult> writeResult = firestore.collection("posts").document(id).delete();
        return writeResult.get().getUpdateTime().toString();
    }

    /**
     * Retrieves a post with the given id
     *
     * @param id id of the post to retrieve
     * @return the post object
     * @throws InterruptedException
     * @throws ExecutionException
     */
    public Post getPostById(String id) throws InterruptedException, ExecutionException {
        // Create empty post object. This will be filled up later on with values from
        // the retrieved document
        Post post = new Post();

        // Retrieve post from firestore based on the given id
        // @TODO: what happens if the post with the given id doesn't exist?
        DocumentSnapshot doc = firestore.collection("posts").document(id).get().get();
        if (doc == null) {
            return null;
        }

        post.setId(doc.getId());
        post.setTitle(doc.getString("title"));
        post.setDescription(doc.getString("description"));
        post.setDate(doc.getTimestamp("date"));
        post.setUrl(doc.getString("url"));

        DocumentReference ds = (DocumentReference) doc.get("userId");
        ApiFuture<DocumentSnapshot> userFuture = ds.get();
        DocumentSnapshot userDoc = userFuture.get();

        if (userDoc.exists()) {
            User user = new User();
            user.setId(ds.getId());
            user.setDisplayName(userDoc.getString("displayName"));
            user.setEmail(userDoc.getString("email"));
            user.setPhotoURL(userDoc.getString("photoURL"));

            post.setUser(user);
        }

        return post;
    }

    @SuppressWarnings("unchecked")
    public boolean checkIfPostLikedByUser(String postId, String userId)
            throws InterruptedException, ExecutionException {
        DocumentReference userRef = firestore.collection("users").document(userId);
        ArrayList<String> likedPosts = (ArrayList<String>) userRef.get().get().get("likedPosts");
        return likedPosts.contains(postId);
    }

    /**
     * Like or unlike a post by passing incrementing the liked count on the
     * post and passing a post reference to the user
     * 
     * @param postId
     * @param userId
     * @param like   - If true like the post, else unlike the post
     * @return
     * @throws InterruptedException
     * @throws ExecutionException
     */
    @SuppressWarnings("unchecked")
    public String likePost(String postId, String userId, boolean like) throws InterruptedException, ExecutionException {
        DocumentReference userRef = firestore.collection("users").document(userId);
        DocumentReference postRef = firestore.collection("posts").document(postId);

        ArrayList<String> likedPosts = (ArrayList<String>) userRef.get().get().get("likedPosts");
        if (like) {
            if (likedPosts.contains(postId)) {
                return null;
            }
            postRef.update("likedCount", FieldValue.increment(1));
            likedPosts.add(postId);
        } else {
            postRef.update("likedCount", FieldValue.increment(-1));
            likedPosts.remove(postId);
        }
        ApiFuture<WriteResult> writeResult = userRef.update("likedPosts", likedPosts);
        return writeResult.get().getUpdateTime().toString();
    
    }


    @SuppressWarnings("unchecked")
    public boolean checkIfPostSaveddByUser(String postId, String userId)
            throws InterruptedException, ExecutionException {
        DocumentReference userRef = firestore.collection("users").document(userId);
        ArrayList<String> savedPosts = (ArrayList<String>) userRef.get().get().get("savedPosts");
        return savedPosts.contains(postId);
    }

    
    /**
     * Save or unsave a post by passing incrementing the saved count on the
     * post and passing a post reference to the user
     * 
     * @param postId
     * @param userId
     * @param like   - If true save the post, else unsave the post
     * @return
     * @throws InterruptedException
     * @throws ExecutionException
     */
    @SuppressWarnings("unchecked")
    public String savePost(String postId, String userId, boolean save) throws InterruptedException, ExecutionException {
        DocumentReference userRef = firestore.collection("users").document(userId);
        DocumentReference postRef = firestore.collection("posts").document(postId);

        ArrayList<String> savedPosts = (ArrayList<String>) userRef.get().get().get("savedPosts");
        if (save) {
            if (savedPosts.contains(postId)) {
                return null;
            }
            postRef.update("savedCount", FieldValue.increment(1));
            savedPosts.add(postId);
        } else {
            postRef.update("savedCount", FieldValue.increment(-1));
            savedPosts.remove(postId);
        }
        ApiFuture<WriteResult> writeResult = userRef.update("savedPosts", savedPosts);
        return writeResult.get().getUpdateTime().toString();
    }

















}
