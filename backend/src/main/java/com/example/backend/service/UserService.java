package com.example.backend.service;

import com.example.backend.model.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
    public User getUserById(String userId) throws ExecutionException, InterruptedException {
        ApiFuture<DocumentSnapshot> future = firestore.collection("users").document(userId).get();
        DocumentSnapshot userDoc = future.get();
        User user = userDoc.toObject(User.class);

        return user;
    }

    public List<User> getUserList() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection("users").limit(50).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<User> users = new ArrayList<>();

        for (QueryDocumentSnapshot document : documents) {
            User user = document.toObject(User.class);
            users.add(user);
        }

        return users;
    }

    public String updateUser(String userId, HashMap<String, Object> userUpdate)
            throws ExecutionException, InterruptedException {
        DocumentReference ref = firestore.collection("users").document(userId);
        ApiFuture<WriteResult> collectionsApiFuture = ref.update(userUpdate);
        return collectionsApiFuture.get().getUpdateTime().toString();
    }

    public String deleteUser(String userId) throws InterruptedException, ExecutionException {
        ApiFuture<WriteResult> writeResult = firestore.collection("users").document(userId).delete();
        return writeResult.get().getUpdateTime().toString();
    }
}
