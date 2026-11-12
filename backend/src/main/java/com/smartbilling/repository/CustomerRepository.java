package com.smartbilling.repository;

import com.smartbilling.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByPhone(String phone);

    @Query("SELECT c FROM Customer c WHERE c.balanceDue > 0 ORDER BY c.balanceDue DESC")
    List<Customer> findCustomersWithDue();

    @Query("SELECT COALESCE(SUM(c.balanceDue), 0) FROM Customer c")
    BigDecimal getTotalOutstandingDue();
}

