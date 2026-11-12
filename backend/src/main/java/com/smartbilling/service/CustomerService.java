package com.smartbilling.service;

import com.smartbilling.model.Customer;
import com.smartbilling.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public List<Customer> getCustomersWithDue() {
        return customerRepository.findCustomersWithDue();
    }

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer recordPaymentReceived(Long customerId, BigDecimal paymentAmount) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));
        BigDecimal currentDue = customer.getBalanceDue() != null ? customer.getBalanceDue() : BigDecimal.ZERO;
        BigDecimal updatedDue = currentDue.subtract(paymentAmount);
        if (updatedDue.compareTo(BigDecimal.ZERO) < 0) {
            updatedDue = BigDecimal.ZERO;
        }
        customer.setBalanceDue(updatedDue);
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}

