package com.example.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class Post {

    @DocumentId
    private String id;
    private String creatorId;

    private Post[] subPosts; //Maybe can just be strings and methods can be written to get all subPosts and have a String array here instead?
    private Post parentPost;

    private String title;
    private String description;


}
