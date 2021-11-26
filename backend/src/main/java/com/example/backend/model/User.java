package com.example.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class User {

    @DocumentId
    private String id;

    // Data of User
    private String pseudoName;
    private String surName;
    private String lastName;

    private String[] followers;
    private String[] following;
}
