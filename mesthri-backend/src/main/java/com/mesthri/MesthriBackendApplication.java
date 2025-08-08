package com.mesthri;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MesthriBackendApplication {

    public static void main(String[] args) {
        System.out.println("🚀 Mesthri App Started");
        SpringApplication.run(MesthriBackendApplication.class, args);
    }
}
