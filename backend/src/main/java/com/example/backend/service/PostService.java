package com.example.backend.service;

import com.example.backend.model.Post;
import com.example.backend.model.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
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

        return getPostList(postsCollection);
    }

    public List<Post> getPostList(int limit) throws ExecutionException, InterruptedException {
        Query postsCollection = firestore.collection("posts")
                .orderBy("date", Direction.DESCENDING)
                .limit(limit);

        return getPostList(postsCollection);
    }

    public List<Post> getPostsFromCategory(String category, Integer limit)
            throws ExecutionException, InterruptedException {
        Query postsCollection = firestore.collection("posts")
                .orderBy("date", Direction.DESCENDING)
                .whereEqualTo("category", category)
                .limit(limit);

        return getPostList(postsCollection);
    }

    public List<Post> getPostList(Query query) throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Post> posts = new ArrayList<>();

        for (QueryDocumentSnapshot document : documents) {
            String id = document.getId();
            Post post = getPostById(id, document);
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
        String category = post.getCategory();
        DocumentReference userRef = firestore.collection("users").document(userId);
        Map<String, Object> postData = new HashMap<>();
        postData.put("date", post.getDate());
        postData.put("description", post.getDescription());
        postData.put("likedCount", post.getLikeCount());
        postData.put("savedCount", post.getSaveCount());
        postData.put("title", post.getTitle());
        postData.put("url", post.getUrl());
        postData.put("userId", userRef);
        postData.put("category", category);
        createOrIncrementCategoryCounter(category);

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
        DocumentReference docRef = firestore.collection("posts").document(post.getId());
        Map<String, Object> updateData = new HashMap<>();
        updateData.put("title", post.getTitle());
        updateData.put("description", post.getDescription());
        updateData.put("category", post.getCategory());

        ApiFuture<WriteResult> future = docRef.update(updateData);
        return future.get().getUpdateTime().toString();
    }

    public String deletePost(String id, String postCategory) throws InterruptedException, ExecutionException {
        DocumentReference docRef = firestore.collection("posts").document(id);
        CollectionReference collectionRef = docRef.collection("comments");

        ApiFuture<WriteResult> writeResult = docRef.delete();
        deleteCollection(collectionRef, 10);
        deleteOrDecrementCategoryCounter(postCategory);
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
    public Post getPostById(String id, DocumentSnapshot doc) throws InterruptedException, ExecutionException {
        // Create empty post object. This will be filled up later on with values from
        // the retrieved document
        Post post = new Post();
        
        if (doc == null) {
            // Retrieve post from firestore based on the given id
            DocumentReference postRef = firestore.collection("posts").document(id);
            doc = postRef.get().get();
            if (!doc.exists()) { 
                return null;
            }
        }

        post.setId(doc.getId());
        post.setTitle(doc.getString("title"));
        post.setDescription(doc.getString("description"));
        post.setDate(doc.getTimestamp("date"));
        post.setUrl(doc.getString("url"));
        post.setCategory(doc.getString("category"));

        DocumentReference ds = (DocumentReference) doc.get("userId");
        ApiFuture<DocumentSnapshot> userFuture = ds.get();
        DocumentSnapshot userDoc = userFuture.get();

        if (userDoc.exists()) {
            UserService userService = new UserService(firestore);

            User user = userService.getUserById(ds.getId());
            post.setUser(user);
        }

        CommentService commentService = new CommentService(firestore);
        post.setComments(commentService.getCommentsFromPost(id));

        return post;
    }

    /**
     * (Un)like or (un)save a post by incrementing the corrensponding
     * field count on the post and passing a post reference to the user
     * 
     * @param field             - Field should be either list of likes or saved
     *                          documents
     * @param postId            - Ref to post
     * @param userId            - Ref to user
     * @param notYetIncremented - If true like the post, else unlike the post
     * @return Timestamp of succesful write
     * @throws InterruptedException
     * @throws ExecutionException
     * @throws IllegalAccessException
     */
    @SuppressWarnings("unchecked")
    public String incrementPost(String field, String postId, String userId, boolean notYetIncremented)
            throws InterruptedException, ExecutionException, IllegalAccessException {
        DocumentReference userRef = firestore.collection("users").document(userId);
        DocumentReference postRef = firestore.collection("posts").document(postId);

        String FIELDCOUNT = null;

        if (field.equals("likedPosts")) {
            FIELDCOUNT = "likedCount";
        } else if (field.equals("savedPosts")) {
            FIELDCOUNT = "savedCount";
        } else {
            throw new IllegalAccessException("Invalid field to increment.");
        }

        ArrayList<String> fieldList = (ArrayList<String>) userRef.get().get().get(field);
        if (notYetIncremented) {
            if (fieldList.contains(postId)) {
                return null;
            }
            postRef.update(FIELDCOUNT, FieldValue.increment(1));
            fieldList.add(postId);
        } else {
            postRef.update(FIELDCOUNT, FieldValue.increment(-1));
            fieldList.remove(postId);
        }
        ApiFuture<WriteResult> writeResult = userRef.update(field, fieldList);
        return writeResult.toString();

    }

    public void createOrIncrementCategoryCounter(String postCategory) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("category")
                .document("SDXBXH2B5iRjgIbebWMR");

        DocumentSnapshot docSnap = docRef.get().get();

        if (!docSnap.getData().containsKey(postCategory)) {
            Map<String, Object> update = new HashMap<>();
            update.put(postCategory, 1);

            docRef.set(update, SetOptions.merge());
        } else {
            docRef.update(postCategory, FieldValue.increment(1));
        }
    }

    public void deleteOrDecrementCategoryCounter(String postCategory) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("category")
                .document("SDXBXH2B5iRjgIbebWMR");

        DocumentSnapshot docSnap = docRef.get().get();
        if (docSnap.getData().containsKey(postCategory)) {
            docRef.update(postCategory, FieldValue.increment(-1));
            if (docSnap.getDouble(postCategory) >= 0) {
                docRef.update(postCategory, FieldValue.delete());
            }
        }
    }

    /**
     * Delete a collection in batches to avoid out-of-memory errors.
     * Batch size may be tuned based on document size (atmost 1MB) and application
     * requirements.
     */
    void deleteCollection(CollectionReference collection, int batchSize) {
        try {
            // retrieve a small batch of documents to avoid out-of-memory errors
            ApiFuture<QuerySnapshot> future = collection.limit(batchSize).get();
            int deleted = 0;
            // future.get() blocks on document retrieval
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            for (QueryDocumentSnapshot document : documents) {
                document.getReference().delete();
                ++deleted;
            }
            if (deleted >= batchSize) {
                // retrieve and delete another batch
                deleteCollection(collection, batchSize);
            }
        } catch (Exception e) {
            System.err.println("Error deleting collection : " + e.getMessage());
        }
    }
}
