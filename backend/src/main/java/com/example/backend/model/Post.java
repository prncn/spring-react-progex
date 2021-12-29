package com.example.backend.model;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class Post {

    @DocumentId
    private String id;
    private User user;

    private String title;
    private String description;
    private Timestamp date;

    private String url;
    private Double likeCount = (double) 0;
}
