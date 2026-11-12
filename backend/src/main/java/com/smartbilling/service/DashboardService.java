package com.smartbilling.service;

import com.smartbilling.dto.DashboardStats;
import com.smartbilling.model.Order;
import com.smartbilling.model.OrderItem;
import com.smartbilling.repository.CustomerRepository;
import com.smartbilling.repository.OrderRepository;
import com.smartbilling.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();

        LocalDateTime startOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        LocalDateTime startOfMonth = LocalDateTime.of(LocalDate.now().withDayOfMonth(1), LocalTime.MIN);

        // 1. Today's stats
        BigDecimal todaySales = orderRepository.sumGrandTotalBetweenDates(startOfToday, endOfToday);
        long todayOrders = orderRepository.countOrdersBetweenDates(startOfToday, endOfToday);
        stats.setTodaySales(todaySales != null ? todaySales : BigDecimal.ZERO);
        stats.setTodayOrdersCount(todayOrders);

        // 2. Month's stats
        BigDecimal monthSales = orderRepository.sumGrandTotalBetweenDates(startOfMonth, endOfToday);
        long monthOrders = orderRepository.countOrdersBetweenDates(startOfMonth, endOfToday);
        stats.setMonthlySales(monthSales != null ? monthSales : BigDecimal.ZERO);
        stats.setMonthlyOrdersCount(monthOrders);

        // 3. Products & Stock
        long totalProducts = productRepository.count();
        long lowStockCount = productRepository.countLowStockProducts();
        stats.setTotalProducts(totalProducts);
        stats.setLowStockCount(lowStockCount);

        // 4. Customers & Dues
        long totalCustomers = customerRepository.count();
        BigDecimal totalDue = customerRepository.getTotalOutstandingDue();
        stats.setTotalCustomers(totalCustomers);
        stats.setTotalOutstandingDue(totalDue != null ? totalDue : BigDecimal.ZERO);

        // 5. Total Revenue & Tax
        List<Order> allOrders = orderRepository.findAllByOrderByOrderDateDesc();
        BigDecimal totalRev = allOrders.stream()
                .map(Order::getGrandTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalTax = allOrders.stream()
                .map(Order::getTaxAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalRevenue(totalRev);
        stats.setTotalTaxCollected(totalTax);

        // Today's estimated profit (Selling Price - Cost Price)
        List<Order> todayOrdersList = orderRepository.findOrdersBetweenDates(startOfToday, endOfToday);
        BigDecimal todayProfit = BigDecimal.ZERO;
        for (Order o : todayOrdersList) {
            for (OrderItem item : o.getItems()) {
                if (item.getUnitCost() != null && item.getUnitPrice() != null) {
                    BigDecimal margin = item.getUnitPrice().subtract(item.getUnitCost())
                            .multiply(BigDecimal.valueOf(item.getQuantity()));
                    todayProfit = todayProfit.add(margin);
                }
            }
        }
        stats.setTodayProfit(todayProfit);

        // 6. Recent Orders (top 5)
        List<Map<String, Object>> recent = allOrders.stream().limit(6).map(o -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", o.getId());
            map.put("invoiceNumber", o.getInvoiceNumber());
            map.put("customerName", o.getCustomer() != null ? o.getCustomer().getName() : "Walk-in");
            map.put("date", o.getOrderDate());
            map.put("grandTotal", o.getGrandTotal());
            map.put("paymentMethod", o.getPaymentMethod());
            map.put("paymentStatus", o.getPaymentStatus());
            map.put("itemCount", o.getItems().size());
            return map;
        }).collect(Collectors.toList());
        stats.setRecentOrders(recent);

        return stats;
    }
}

