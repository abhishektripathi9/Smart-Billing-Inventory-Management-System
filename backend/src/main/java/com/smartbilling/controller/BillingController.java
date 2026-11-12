package com.smartbilling.controller;

import com.smartbilling.dto.OrderRequest;
import com.smartbilling.model.Order;
import com.smartbilling.service.BillingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(billingService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(billingService.getOrderById(id));
    }

    @GetMapping("/invoice/{invoiceNumber}")
    public ResponseEntity<Order> getOrderByInvoiceNumber(@PathVariable String invoiceNumber) {
        return ResponseEntity.ok(billingService.getOrderByInvoiceNumber(invoiceNumber));
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest request) {
        try {
            Order order = billingService.createOrder(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + ex.getMessage() + "\"}");
        }
    }
}

