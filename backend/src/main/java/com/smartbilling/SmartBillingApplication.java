package com.smartbilling;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartBillingApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartBillingApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 Smart Billing & Inventory Backend is RUNNING!");
        System.out.println("📍 REST API Base: http://localhost:8080/api");
        System.out.println("📍 H2 Database Console: http://localhost:8080/h2-console");
        System.out.println("=================================================");
    }
}

