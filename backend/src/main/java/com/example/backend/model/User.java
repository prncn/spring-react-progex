package com.example.backend.model;

import java.util.ArrayList;
import java.util.HashMap;

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

    private ArrayList<String> followers = new ArrayList<>();
    private ArrayList<String> following = new ArrayList<>();

    private ArrayList<HashMap<String, Object>> messages = new ArrayList<>();
}
