package com.example.backend.model;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class Comment {
    @DocumentId
    private String id;
    private User user;
    private String description;
    private Timestamp date;
}