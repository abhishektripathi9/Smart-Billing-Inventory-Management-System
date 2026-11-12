package com.smartbilling.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStats {

    private BigDecimal todaySales = BigDecimal.ZERO;
    private long todayOrdersCount = 0;
    private BigDecimal monthlySales = BigDecimal.ZERO;
    private long monthlyOrdersCount = 0;

    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private BigDecimal todayProfit = BigDecimal.ZERO;
    private BigDecimal totalTaxCollected = BigDecimal.ZERO;

    private long totalProducts = 0;
    private long lowStockCount = 0;
    private long totalCustomers = 0;
    private BigDecimal totalOutstandingDue = BigDecimal.ZERO;

    private List<Map<String, Object>> recentOrders;
    private List<Map<String, Object>> topSellingProducts;

    public DashboardStats() {}

    public BigDecimal getTodaySales() { return todaySales; }
    public void setTodaySales(BigDecimal todaySales) { this.todaySales = todaySales; }

    public long getTodayOrdersCount() { return todayOrdersCount; }
    public void setTodayOrdersCount(long todayOrdersCount) { this.todayOrdersCount = todayOrdersCount; }

    public BigDecimal getMonthlySales() { return monthlySales; }
    public void setMonthlySales(BigDecimal monthlySales) { this.monthlySales = monthlySales; }

    public long getMonthlyOrdersCount() { return monthlyOrdersCount; }
    public void setMonthlyOrdersCount(long monthlyOrdersCount) { this.monthlyOrdersCount = monthlyOrdersCount; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public BigDecimal getTodayProfit() { return todayProfit; }
    public void setTodayProfit(BigDecimal todayProfit) { this.todayProfit = todayProfit; }

    public BigDecimal getTotalTaxCollected() { return totalTaxCollected; }
    public void setTotalTaxCollected(BigDecimal totalTaxCollected) { this.totalTaxCollected = totalTaxCollected; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public BigDecimal getTotalOutstandingDue() { return totalOutstandingDue; }
    public void setTotalOutstandingDue(BigDecimal totalOutstandingDue) { this.totalOutstandingDue = totalOutstandingDue; }

    public List<Map<String, Object>> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<Map<String, Object>> recentOrders) { this.recentOrders = recentOrders; }

    public List<Map<String, Object>> getTopSellingProducts() { return topSellingProducts; }
    public void setTopSellingProducts(List<Map<String, Object>> topSellingProducts) { this.topSellingProducts = topSellingProducts; }
}

