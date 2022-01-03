package com.example.backend.service;

import com.example.backend.model.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.concurrent.ExecutionException;

@Service
public class UserService {
    private Firestore firestore;

    public UserService(Firestore firestore) {
        this.firestore = firestore;
    }

    /**
     * Get the user by id and return only that user.
     * 
     * @param userId of specific user that should be returned
     * @return full userinfo by querying the id through the user db
     * @throws ExecutionException
     * @throws InterruptedException
     */
    @SuppressWarnings("unchecked")
    public User getUserById(String userId) throws ExecutionException, InterruptedException {
        ApiFuture<DocumentSnapshot> future = firestore.collection("users").document(userId).get();
        DocumentSnapshot userDoc = future.get();

        User user = new User();
        user.setId(userDoc.getId());
        user.setDisplayName(userDoc.getString("displayName"));
        user.setPhotoURL(userDoc.getString("photoURL"));
        user.setEmail(userDoc.getString("email"));
        user.setLikedPosts((ArrayList<String>) userDoc.get("likedPosts"));
        user.setSavedPosts((ArrayList<String>) userDoc.get("savedPosts"));

        return user;
    }

    public String updateUser(User user) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> collectionsApiFuture = firestore.collection("users").document(user.getId()).set(user);
        return collectionsApiFuture.get().getUpdateTime().toString();
    }

    public String deleteUser(String userId) throws InterruptedException, ExecutionException {
        ApiFuture<WriteResult> writeResult = firestore.collection("users").document(userId).delete();
        return writeResult.get().getUpdateTime().toString();
    }
}
