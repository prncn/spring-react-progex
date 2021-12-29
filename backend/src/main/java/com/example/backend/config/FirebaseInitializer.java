package com.example.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Service
public class FirebaseInitializer {

    @PostConstruct
    public void initialize() throws IOException {
        String path = "src/main/resources/static/prog-ex-firebase-adminsdk.json";
        File credentials;

        try {
            credentials = new File(path);
        } catch (Exception e) {
            credentials = new File("backend/" + path);
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(new FileInputStream(credentials)))
                .build();

        FirebaseApp.initializeApp(options);
    }
}
