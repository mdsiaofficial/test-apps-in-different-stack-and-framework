package com.example.app;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        applyDatabaseUrl();
        SpringApplication.run(Application.class, args);
    }

    /**
     * Accept the same DATABASE_URL (postgres://user:pass@host:port/db) used by
     * every other app and translate it to Spring's JDBC settings. System
     * properties take precedence over application.properties.
     */
    private static void applyDatabaseUrl() {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            return;
        }
        URI uri = URI.create(databaseUrl);
        String[] userInfo = uri.getUserInfo() == null
                ? new String[0]
                : uri.getUserInfo().split(":", 2);
        int port = uri.getPort() > 0 ? uri.getPort() : 5432;
        System.setProperty("spring.datasource.url",
                "jdbc:postgresql://" + uri.getHost() + ":" + port + uri.getPath());
        if (userInfo.length > 0) {
            System.setProperty("spring.datasource.username",
                    URLDecoder.decode(userInfo[0], StandardCharsets.UTF_8));
        }
        if (userInfo.length > 1) {
            System.setProperty("spring.datasource.password",
                    URLDecoder.decode(userInfo[1], StandardCharsets.UTF_8));
        }
    }
}
