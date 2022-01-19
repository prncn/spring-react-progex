package com.example.backend.model;

import java.util.ArrayList;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class User {

    @DocumentId
    private String id;

    private String displayName;
    private String photoURL;
    private String email;

    private ArrayList<String> likedPosts = new ArrayList<>();
    private ArrayList<String> savedPosts = new ArrayList<>();
}
