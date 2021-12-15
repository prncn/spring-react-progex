package com.example.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class User {

    @DocumentId
    private String id;

    private String displayName;
    private String photoURL;
    private String email;
}
