package com.example.backend.model;


import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class PostDocument {

    @DocumentId
    private String id;
    private DocumentReference userId;

    private String title; 
    private String description; 
    private Timestamp date;

    private String url; 

    public PostDocument(Post post, DocumentReference ref) {
        this.id = post.getId();
        this.userId = ref;
        this.title = post.getTitle();
        this.description = post.getDescription();
        this.date = post.getDate();
        this.url = post.getUrl();        
    }
}
