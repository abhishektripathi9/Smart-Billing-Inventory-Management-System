package com.smartbilling.service;

import com.smartbilling.dto.OrderItemRequest;
import com.smartbilling.dto.OrderRequest;
import com.smartbilling.model.Customer;
import com.smartbilling.model.Order;
import com.smartbilling.model.OrderItem;
import com.smartbilling.model.Product;
import com.smartbilling.repository.CustomerRepository;
import com.smartbilling.repository.OrderRepository;
import com.smartbilling.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Transactional
public class BillingService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public Order createOrder(OrderRequest request) {
        Order order = new Order();

        // 1. Generate unique Invoice Number
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomSuffix = ThreadLocalRandom.current().nextInt(1000, 9999);
        order.setInvoiceNumber("INV-" + datePrefix + "-" + randomSuffix);
        order.setOrderDate(LocalDateTime.now());

        // 2. Resolve Customer
        Customer customer = null;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId()).orElse(null);
        } else if (request.getCustomerPhone() != null && !request.getCustomerPhone().trim().isEmpty()) {
            customer = customerRepository.findByPhone(request.getCustomerPhone().trim())
                    .orElseGet(() -> {
                        Customer newCust = new Customer();
                        newCust.setName(request.getCustomerName() != null ? request.getCustomerName() : "Customer");
                        newCust.setPhone(request.getCustomerPhone());
                        newCust.setGstin(request.getCustomerGstin());
                        return customerRepository.save(newCust);
                    });
        }
        order.setCustomer(customer);

        // 3. Process Items & Calculate GST
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemReq.getProductId()));

            // Deduct inventory stock
            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Not enough stock for '" + product.getName() + "'. Available: " + product.getStockQuantity());
            }
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setProductSku(product.getSku());
            orderItem.setHsnCode(product.getHsnCode());
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setUnitCost(product.getCostPrice());

            BigDecimal unitPrice = itemReq.getUnitPrice() != null ? itemReq.getUnitPrice() : product.getSellingPrice();
            orderItem.setUnitPrice(unitPrice);

            BigDecimal lineDiscount = itemReq.getDiscountAmount() != null ? itemReq.getDiscountAmount() : BigDecimal.ZERO;
            orderItem.setDiscountAmount(lineDiscount);

            // Line subtotal = (Unit Price * Quantity) - Discount
            BigDecimal rawLineTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity())).subtract(lineDiscount);
            if (rawLineTotal.compareTo(BigDecimal.ZERO) < 0) rawLineTotal = BigDecimal.ZERO;
            orderItem.setSubtotal(rawLineTotal);

            // GST calculation for line item
            BigDecimal gstRate = product.getGstRate() != null ? product.getGstRate() : BigDecimal.ZERO;
            orderItem.setGstRate(gstRate);

            BigDecimal lineTax = rawLineTotal.multiply(gstRate)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            orderItem.setTaxAmount(lineTax);

            BigDecimal lineTotalWithTax = rawLineTotal.add(lineTax);
            orderItem.setTotalAmount(lineTotalWithTax);

            subtotal = subtotal.add(rawLineTotal);
            totalTax = totalTax.add(lineTax);

            order.addItem(orderItem);
        }

        order.setSubtotal(subtotal);

        // 4. Order Level Discount & Shipping
        BigDecimal orderDiscount = request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO;
        if (request.getDiscountPercentage() != null && request.getDiscountPercentage().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal percentageDiscount = subtotal.multiply(request.getDiscountPercentage())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            orderDiscount = orderDiscount.add(percentageDiscount);
        }
        order.setDiscountAmount(orderDiscount);
        order.setDiscountPercentage(request.getDiscountPercentage() != null ? request.getDiscountPercentage() : BigDecimal.ZERO);

        BigDecimal shipping = request.getShippingCharge() != null ? request.getShippingCharge() : BigDecimal.ZERO;
        order.setShippingCharge(shipping);

        // 5. Total GST Split (Intrastate: CGST 50% + SGST 50%)
        order.setTaxAmount(totalTax);
        BigDecimal halfTax = totalTax.divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
        order.setCgstAmount(halfTax);
        order.setSgstAmount(totalTax.subtract(halfTax));
        order.setIgstAmount(BigDecimal.ZERO);

        // Grand Total = Subtotal - Discount + Tax + Shipping
        BigDecimal grandTotal = subtotal.subtract(orderDiscount).add(totalTax).add(shipping);
        if (grandTotal.compareTo(BigDecimal.ZERO) < 0) grandTotal = BigDecimal.ZERO;
        order.setGrandTotal(grandTotal);

        // 6. Payment & Due Balance Calculation
        String paymentMethod = request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "CASH";
        order.setPaymentMethod(paymentMethod);
        order.setNotes(request.getNotes());

        BigDecimal paid = request.getAmountPaid() != null ? request.getAmountPaid() : grandTotal;
        if ("DUE".equals(paymentMethod)) {
            paid = request.getAmountPaid() != null ? request.getAmountPaid() : BigDecimal.ZERO;
        }

        order.setAmountPaid(paid);

        if (paid.compareTo(grandTotal) >= 0) {
            order.setChangeReturned(paid.subtract(grandTotal));
            order.setDueAmount(BigDecimal.ZERO);
            order.setPaymentStatus("PAID");
        } else {
            BigDecimal remainingDue = grandTotal.subtract(paid);
            order.setDueAmount(remainingDue);
            order.setChangeReturned(BigDecimal.ZERO);
            order.setPaymentStatus(paid.compareTo(BigDecimal.ZERO) > 0 ? "PARTIALLY_PAID" : "UNPAID");

            // Update customer outstanding ledger if due exists
            if (customer != null) {
                BigDecimal currentDue = customer.getBalanceDue() != null ? customer.getBalanceDue() : BigDecimal.ZERO;
                customer.setBalanceDue(currentDue.add(remainingDue));
            }
        }

        if (customer != null) {
            BigDecimal spent = customer.getTotalSpent() != null ? customer.getTotalSpent() : BigDecimal.ZERO;
            customer.setTotalSpent(spent.add(grandTotal));
            customerRepository.save(customer);
        }

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
    }

    public Order getOrderByInvoiceNumber(String invoiceNumber) {
        return orderRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new RuntimeException("Invoice not found: " + invoiceNumber));
    }
}

