package com.shrihari.collection.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import javax.sql.DataSource;
import java.util.Optional;

@Configuration
public class DataSourceConfig {

    @Bean
    @ConditionalOnProperty(name = "DB_URL")
    public DataSource dataSource() {
        String url = System.getenv("DB_URL");
        String username = System.getenv("DB_USERNAME");
        String password = System.getenv("DB_PASSWORD");

        HikariConfig config = new HikariConfig();

        if (url != null && !url.isBlank() && username != null) {
            // Use provided MySQL configuration
            config.setJdbcUrl(url);
            config.setUsername(username);
            config.setPassword(Optional.ofNullable(password).orElse(""));
            config.setDriverClassName(System.getenv("DB_DRIVER") != null ? System.getenv("DB_DRIVER") : "com.mysql.cj.jdbc.Driver");
        } else {
            // Fall back to properties-driven datasource (H2) - allow Spring Boot to override via properties
            // Return null here so auto-configuration uses `spring.datasource.*` properties
            return null;
        }

        // sensible defaults
        config.setMaximumPoolSize(10);
        config.setPoolName("shc-hikari-pool");

        return new HikariDataSource(config);
    }
}
