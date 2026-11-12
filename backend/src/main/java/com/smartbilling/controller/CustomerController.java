package com.smartbilling.controller;

import com.smartbilling.model.Customer;
import com.smartbilling.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers(@RequestParam(required = false) Boolean hasDue) {
        if (Boolean.TRUE.equals(hasDue)) {
            return ResponseEntity.ok(customerService.getCustomersWithDue());
        }
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerService.saveCustomer(customer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @Valid @RequestBody Customer customer) {
        customer.setId(id);
        return ResponseEntity.ok(customerService.saveCustomer(customer));
    }

    @PostMapping("/{id}/settle-due")
    public ResponseEntity<Customer> settleDue(@PathVariable Long id, @RequestBody Map<String, BigDecimal> payload) {
        BigDecimal amount = payload.getOrDefault("amount", BigDecimal.ZERO);
        return ResponseEntity.ok(customerService.recordPaymentReceived(id, amount));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}

