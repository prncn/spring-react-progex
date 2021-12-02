package com.example.backend.model;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class Post {

    @DocumentId
    private String id;
    private String authorId;

    /** Maybe can just be strings and methods can be written to get 
     * all subPosts and have a String array here instead? */
    private String content; 
    private Timestamp date;

    private String icon;
    private String url;

    public Post() {
        /** Empty Constructor */
    }

    public Post(String authorId, String content, Timestamp date, String icon, String url) {
        this.authorId = authorId;
        this.content = content;
        this.date = date;
        this.icon = icon;
        this.url = url;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
