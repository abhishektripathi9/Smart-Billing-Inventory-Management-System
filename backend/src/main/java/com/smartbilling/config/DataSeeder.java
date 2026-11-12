package com.smartbilling.config;

import com.smartbilling.model.*;
import com.smartbilling.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return; // Data already seeded
        }

        System.out.println("🌱 Seeding initial demo data for Smart Billing System...");

        // 1. Categories
        Category catClothes = new Category("Clothes & Shoes", "CAT-CLOTH-SHOE", "shirt", "Apparel, footwear and fashion wear");
        Category catGirls = new Category("Girl's Clothing", "CAT-GIRL-WEAR", "sparkles", "Women and girls modern dresses & casuals");
        Category catFashion = new Category("Fashion Accessories", "CAT-FASHION", "watch", "Watches, belts, bags and styling accessories");
        Category catGrocery = new Category("Grocery & Staples", "CAT-GROCERY", "shopping-basket", "Daily groceries, pulses, grains and spices");
        Category catMedical = new Category("Medical & Pharmacy", "CAT-MEDICINE", "pill", "Pharmaceuticals, healthcare and personal care");
        Category catElectronics = new Category("Electronics & Gadgets", "CAT-ELEC", "smartphone", "Mobile accessories, audio and smart devices");

        categoryRepository.saveAll(Arrays.asList(catClothes, catGirls, catFashion, catGrocery, catMedical, catElectronics));

        // 2. Products
        Product p1 = new Product("T-Shirt Men Royal Blue Slim Fit", "TSH-ROYAL-M", "890123450001", catClothes, "RoyalWear",
                "pcs", new BigDecimal("240.00"), new BigDecimal("399.00"), new BigDecimal("599.00"),
                48, 10, new BigDecimal("5.00"), "610910", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=60");

        Product p2 = new Product("Casual Cotton Green Summer Dress", "DRS-SUMMER-G", "890123450002", catGirls, "Aura Fashion",
                "pcs", new BigDecimal("550.00"), new BigDecimal("899.00"), new BigDecimal("1299.00"),
                22, 5, new BigDecimal("12.00"), "620442", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&auto=format&fit=crop&q=60");

        Product p3 = new Product("High-Rise Beige Linen Trousers", "TRS-BEIGE-32", "890123450003", catClothes, "UrbanFit",
                "pcs", new BigDecimal("450.00"), new BigDecimal("749.00"), new BigDecimal("999.00"),
                15, 5, new BigDecimal("12.00"), "620342", "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&auto=format&fit=crop&q=60");

        Product p4 = new Product("Floral Print Chiffon Maxi Dress", "DRS-FLORAL-M", "890123450004", catGirls, "Bella Bella",
                "pcs", new BigDecimal("700.00"), new BigDecimal("1199.00"), new BigDecimal("1699.00"),
                18, 5, new BigDecimal("12.00"), "620444", "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&auto=format&fit=crop&q=60");

        Product p5 = new Product("Men's Denim Trucker Jacket", "JKT-DENIM-L", "890123450005", catClothes, "LeviStrauss",
                "pcs", new BigDecimal("1100.00"), new BigDecimal("1799.00"), new BigDecimal("2499.00"),
                8, 5, new BigDecimal("12.00"), "620140", "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&auto=format&fit=crop&q=60");

        Product p6 = new Product("Sport Running Sneakers Mesh White", "SHOE-RUN-W42", "890123450006", catClothes, "AeroStride",
                "pair", new BigDecimal("800.00"), new BigDecimal("1349.00"), new BigDecimal("1999.00"),
                14, 4, new BigDecimal("18.00"), "640411", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=60");

        Product p7 = new Product("Basmati Premium Royal Rice 5kg", "GROC-RICE-5KG", "890123450007", catGrocery, "IndiaGate",
                "bag", new BigDecimal("380.00"), new BigDecimal("480.00"), new BigDecimal("520.00"),
                35, 10, new BigDecimal("0.00"), "100630", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=60");

        Product p8 = new Product("Cold-Pressed Pure Sunflower Oil 1L", "GROC-OIL-1L", "890123450008", catGrocery, "Fortune",
                "bottle", new BigDecimal("130.00"), new BigDecimal("165.00"), new BigDecimal("180.00"),
                4, 10, new BigDecimal("5.00"), "151219", "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=60"); // Low stock

        Product p9 = new Product("Paracetamol 650mg Strip of 15", "MED-DOLO-650", "890123450009", catMedical, "MicroLabs",
                "strip", new BigDecimal("22.00"), new BigDecimal("32.00"), new BigDecimal("35.00"),
                80, 20, new BigDecimal("12.00"), "300490", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60");

        Product p10 = new Product("Vitamin C Zinc Chewable 30s", "MED-VITC-30", "890123450010", catMedical, "Limcee",
                "bottle", new BigDecimal("75.00"), new BigDecimal("115.00"), new BigDecimal("130.00"),
                3, 15, new BigDecimal("12.00"), "300450", "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=60"); // Low stock

        Product p11 = new Product("Wireless Bluetooth Earbuds Pro", "ELEC-TWS-01", "890123450011", catElectronics, "SoundPod",
                "pcs", new BigDecimal("650.00"), new BigDecimal("1099.00"), new BigDecimal("1999.00"),
                12, 5, new BigDecimal("18.00"), "851830", "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=60");

        Product p12 = new Product("Fast Charging Cable USB-C 65W", "ELEC-CABLE-65W", "890123450012", catElectronics, "AnkerPower",
                "pcs", new BigDecimal("120.00"), new BigDecimal("249.00"), new BigDecimal("399.00"),
                2, 8, new BigDecimal("18.00"), "854442", "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=60"); // Low stock

        productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12));

        // 3. Customers
        Customer c1 = new Customer("Walk-in Customer", "0000000000", "walkin@store.com", "Counter Sale", null);
        Customer c2 = new Customer("Rahul Sharma", "+91 98201 11223", "rahul.sharma@gmail.com", "B-402, Lotus Enclave, Andheri West, Mumbai", "27ABCPS1234D1Z5");
        Customer c3 = new Customer("Priya Patel", "+91 98765 22334", "priya.patel@outlook.com", "12, Sunrise Residency, Borivali, Mumbai", null);
        c3.setBalanceDue(new BigDecimal("350.00"));
        c3.setTotalSpent(new BigDecimal("14200.00"));

        Customer c4 = new Customer("Vikram Singh (Wholesale)", "+91 91234 56789", "vikram.singh@yahoo.com", "Shop 4, Market Yard, Dadar, Mumbai", "27AABCS5566K1Z9");
        c4.setBalanceDue(new BigDecimal("1200.00"));
        c4.setTotalSpent(new BigDecimal("32500.00"));

        customerRepository.saveAll(Arrays.asList(c1, c2, c3, c4));

        // 4. Suppliers
        Supplier s1 = new Supplier("Textile World Wholesalers", "Anand Kulkarni", "+91 98230 44556", "orders@textileworld.in", "27AAACT1234E1Z1", "Surat Textile Market, Surat");
        s1.setOutstandingPayable(new BigDecimal("14500.00"));
        Supplier s2 = new Supplier("Metro Grocery Distributors", "Mahesh Jain", "+91 98450 77889", "supply@metrogrocery.in", "27AAACM9988D1Z2", "APMC Market, Vashi, Navi Mumbai");
        s2.setOutstandingPayable(new BigDecimal("6200.00"));
        Supplier s3 = new Supplier("PharmaCare Life Sciences", "Dr. Sunil Mehta", "+91 98110 33221", "sales@pharmacare.com", "27AAACP3344F1Z7", "Bhiwandi Pharma Hub, Thane");

        supplierRepository.saveAll(Arrays.asList(s1, s2, s3));

        // 5. Initial Sample Invoices
        Order order1 = new Order();
        order1.setInvoiceNumber("INV-20261109-1001");
        order1.setCustomer(c2);
        order1.setOrderDate(LocalDateTime.now().minusHours(4));
        order1.setSubtotal(new BigDecimal("1148.00"));
        order1.setDiscountAmount(new BigDecimal("50.00"));
        order1.setTaxAmount(new BigDecimal("82.38"));
        order1.setCgstAmount(new BigDecimal("41.19"));
        order1.setSgstAmount(new BigDecimal("41.19"));
        order1.setGrandTotal(new BigDecimal("1180.38"));
        order1.setPaymentMethod("UPI");
        order1.setPaymentStatus("PAID");
        order1.setAmountPaid(new BigDecimal("1180.38"));

        OrderItem item1 = new OrderItem();
        item1.setProduct(p1);
        item1.setProductName(p1.getName());
        item1.setProductSku(p1.getSku());
        item1.setQuantity(2);
        item1.setUnitPrice(p1.getSellingPrice());
        item1.setUnitCost(p1.getCostPrice());
        item1.setGstRate(p1.getGstRate());
        item1.setSubtotal(new BigDecimal("798.00"));
        item1.setTaxAmount(new BigDecimal("39.90"));
        item1.setTotalAmount(new BigDecimal("837.90"));
        order1.addItem(item1);

        OrderItem item2 = new OrderItem();
        item2.setProduct(p3);
        item2.setProductName(p3.getName());
        item2.setProductSku(p3.getSku());
        item2.setQuantity(1);
        item2.setUnitPrice(p3.getSellingPrice());
        item2.setUnitCost(p3.getCostPrice());
        item2.setGstRate(p3.getGstRate());
        item2.setSubtotal(new BigDecimal("749.00"));
        item2.setTaxAmount(new BigDecimal("89.88"));
        item2.setTotalAmount(new BigDecimal("838.88"));
        order1.addItem(item2);

        orderRepository.save(order1);

        System.out.println("✅ Data seeding complete!");
    }
}

