const db = {
    admins: [
        {
            id: 1,
            name: "Ibaa",
            email: "ibaa@example.com",
            password: "ibaa123",
            status: "active",
            createdAt: "2023-01-01T00:00:00Z",
            lastLogin: "2023-06-15T00:00:00Z"
        },
        {
            id: 2,
            name: "Seif",
            email: "seif@example.com",
            password: "secure456",
            status: "active",
            createdAt: "2023-02-15T00:00:00Z",
            lastLogin: "2023-06-10T00:00:00Z"
        },
        {
            id: 3,
            name: "Ahmed",
            email: "ahmed@example.com",
            password: "test123",
            status: "blocked",
            createdAt: "2023-03-20T00:00:00Z",
            lastLogin: "2023-04-01T00:00:00Z"
        }
    ],

    findAdminByEmail: function (email) {
        return this.admins.find(admin => admin.email === email);
    },
    findAdminById: function (id) {
        return this.admins.find(admin => admin.id === id);
    },
    getAllAdmins: function () {
        return [...this.admins];
    },
    updateAdmin: function (id, updates) {
        const index = this.admins.findIndex(admin => admin.id === id);
        if (index !== -1) {
            this.admins[index] = { ...this.admins[index], ...updates };
            return this.admins[index];
        }
        return null;
    },

    // products: [
    //     {
    //         id: 1,
    //         title: "iPhone 16 Pro Max",
    //         brand: "Apple",
    //         price: 1399.99,
    //         images: [
    //             "images/iphone16pro-front.png",
    //             "images/iphone16pro-back.png",
    //             "images/iphone16pro-side.png"
    //         ],
    //         category: "Smartphones",
    //         properties: {
    //             storage: "256GB",
    //             color: "Space Black",
    //             screenSize: "6.7 inches",
    //             processor: "A18 Pro",
    //             camera: "Triple 48MP system",
    //             battery: "4323 mAh",
    //             os: "iOS 18"
    //         },
    //         rating: 4.8,
    //         stock: 45,
    //         discount: 15,
    //         sku: "APL-IP16P-256-BK"
    //     },
    //     {
    //         id: 2,
    //         title: "Galaxy S24 Ultra",
    //         brand: "Samsung",
    //         price: 1299.99,
    //         images: [
    //             "images/s24ultra-front.jpg",
    //             "images/s24ultra-back.jpg"
    //         ],
    //         category: "Smartphones",
    //         properties: {
    //             storage: "512GB",
    //             color: "Titanium Gray",
    //             screenSize: "6.8 inches",
    //             processor: "Snapdragon 8 Gen 3",
    //             camera: "Quad 200MP system",
    //             battery: "5000 mAh",
    //             os: "Android 14"
    //         },
    //         rating: 4.7,
    //         stock: 32,
    //         sku: "SAM-GS24U-512-GY"
    //     },
    //     {
    //         id: 3,
    //         title: "MacBook Pro 16\" M3 Max",
    //         brand: "Apple",
    //         price: 3499.99,
    //         images: [
    //             "images/mbp16-front.jpg",
    //             "images/mbp16-angle.jpg"
    //         ],
    //         category: "Laptops",
    //         properties: {
    //             storage: "1TB SSD",
    //             color: "Space Gray",
    //             screenSize: "16.2 inches",
    //             processor: "M3 Max 16-core",
    //             memory: "64GB unified",
    //             ports: "HDMI, 3x USB-C, SDXC",
    //             os: "macOS Sonoma"
    //         },
    //         rating: 4.9,
    //         stock: 18,
    //         discount: 10,
    //         sku: "APL-MBP16-M3-1TB"
    //     },
    //     {
    //         id: 4,
    //         title: "XPS 15 OLED",
    //         brand: "Dell",
    //         price: 2299.99,
    //         images: [
    //             "images/xps15-front.jpg",
    //             "images/xps15-open.jpg"
    //         ],
    //         category: "Laptops",
    //         properties: {
    //             storage: "1TB SSD",
    //             color: "Platinum",
    //             screenSize: "15.6\" 4K OLED",
    //             processor: "Intel Core i9-13900H",
    //             memory: "32GB DDR5",
    //             graphics: "NVIDIA RTX 4070",
    //             os: "Windows 11 Pro"
    //         },
    //         rating: 4.6,
    //         stock: 22,
    //         sku: "DEL-XPS15-1TB-PL"
    //     },
    //     {
    //         id: 5,
    //         title: "Logitech MX Master 3S",
    //         brand: "Logitech",
    //         price: 99.99,
    //         images: [
    //             "images/mxmaster3s-front.jpg",
    //             "images/mxmaster3s-side.jpg"
    //         ],
    //         category: "Computer Accessories",
    //         properties: {
    //             color: "Graphite",
    //             connectivity: "Bluetooth/Unifying",
    //             buttons: "7 programmable",
    //             sensor: "8000 DPI",
    //             battery: "70 days",
    //             compatible: "Windows/macOS"
    //         },
    //         rating: 4.8,
    //         stock: 87,
    //         discount: 20,
    //         sku: "LOG-MXM3S-GR"
    //     },
    //     {
    //         id: 6,
    //         title: "Keychron K8 Pro",
    //         brand: "Keychron",
    //         price: 119.99,
    //         images: [
    //             "images/k8pro-front.jpg",
    //             "images/k8pro-angle.jpg"
    //         ],
    //         category: "Computer Accessories",
    //         properties: {
    //             type: "Mechanical",
    //             switches: "Gateron G Pro (Red)",
    //             layout: "TKL",
    //             connectivity: "Bluetooth/Wired",
    //             backlight: "RGB",
    //             compatible: "Windows/macOS"
    //         },
    //         rating: 4.7,
    //         stock: 53,
    //         sku: "KEY-K8P-RED"
    //     },
    //     {
    //         id: 7,
    //         title: "Sony WH-1000XM5",
    //         brand: "Sony",
    //         price: 399.99,
    //         images: [
    //             "images/xm5-front.jpg",
    //             "images/xm5-folded.jpg"
    //         ],
    //         category: "Audio",
    //         properties: {
    //             type: "Over-ear",
    //             noiseCancelling: "Yes (Premium)",
    //             battery: "30 hours",
    //             connectivity: "Bluetooth 5.2",
    //             weight: "250g",
    //             color: "Black"
    //         },
    //         rating: 4.9,
    //         stock: 29,
    //         discount: 12,
    //         sku: "SON-WHXM5-BK"
    //     },
    //     {
    //         id: 8,
    //         title: "Apple Watch Ultra 2",
    //         brand: "Apple",
    //         price: 799.99,
    //         images: [
    //             "images/watchultra-front.jpg",
    //             "images/watchultra-wrist.jpg"
    //         ],
    //         category: "Wearables",
    //         properties: {
    //             caseSize: "49mm",
    //             material: "Titanium",
    //             display: "Always-On Retina",
    //             waterResistance: "100m",
    //             battery: "36 hours",
    //             os: "watchOS 10"
    //         },
    //         rating: 4.8,
    //         stock: 41,
    //         sku: "APL-AWU2-TI"
    //     }
    // ],
    // products: [
    //     // Your product data here
    //     {
    //         id: 1,
    //         title: "iPhone 16 Pro Max",
    //         brand: "Apple",
    //         price: 50000.00,
    //         discount: 10,
    //         images: ["images/iphone16pro-removebg-preview.png"],
    //         properties: {
    //             storage: "256GB"
    //         }
    //     },
    //     // Add more products as needed
    // ],
    products: [
        {
            id: 1,
            title: "iPhone 16 Pro Max",
            brand: "Apple",
            price: 50000.00,
            discount: 10,
            images: ["images/iphone16pro-removebg-preview.png"],
            properties: {
                storage: "256GB"
            }
        },
        {
            id: 2,
            title: "Galaxy S24 Ultra",
            brand: "Samsung",
            price: 45000.00,
            discount: 8,
            images: ["images/galaxys24ultra-removebg-preview.png"],
            properties: {
                storage: "512GB"
            }
        },
        {
            id: 3,
            title: "Pixel 9 Pro",
            brand: "Google",
            price: 40000.00,
            discount: 5,
            images: ["images/pixel9pro-removebg-preview.png"],
            properties: {
                storage: "128GB"
            }
        },
        {
            id: 4,
            title: "OnePlus 12",
            brand: "OnePlus",
            price: 35000.00,
            discount: 12,
            images: ["images/oneplus12-removebg-preview.png"],
            properties: {
                storage: "256GB"
            }
        },
        {
            id: 5,
            title: "Xiaomi 14 Pro",
            brand: "Xiaomi",
            price: 32000.00,
            discount: 15,
            images: ["images/xiaomi14pro-removebg-preview.png"],
            properties: {
                storage: "256GB"
            }
        }
    ],
    getAllProducts: function() {
        return this.products;
    },
    
    getUniqueBrands: function() {
        const brands = new Set();
        this.products.forEach(product => brands.add(product.brand));
        return Array.from(brands);
    },
    
    getProductsByBrand: function(brand) {
        return this.products.filter(product => product.brand === brand);
    }

    // // PRODUCT MANAGEMENT FUNCTIONS
    // // Get all products
    // getAllProducts: function () {
    //     return [...this.products];
    // },

    // // Find product by ID
    // getProductById: function (id) {
    //     return this.products.find(product => product.id === id);
    // },

    // // Find products by category
    // getProductsByCategory: function (category) {
    //     return this.products.filter(product => product.category === category);
    // },

    // // Find products by brand
    // getProductsByBrand: function (brand) {
    //     return this.products.filter(product => product.brand === brand);
    // },

    // // Search products by keyword (searches title, brand, and properties)
    // searchProducts: function (keyword) {
    //     const searchTerm = keyword.toLowerCase();
    //     return this.products.filter(product => {
    //         return (
    //             product.title.toLowerCase().includes(searchTerm) ||
    //             product.brand.toLowerCase().includes(searchTerm) ||
    //             Object.values(product.properties).some(prop =>
    //                 prop.toString().toLowerCase().includes(searchTerm)
    //             ));
    //     });
    // },

    // // Filter products by price range
    // filterProductsByPrice: function (minPrice, maxPrice) {
    //     return this.products.filter(product =>
    //         product.price >= minPrice && product.price <= maxPrice
    //     );
    // },

    // // Filter products by multiple criteria
    // filterProducts: function (criteria = {}) {
    //     return this.products.filter(product => {
    //         // Check each criteria against the product
    //         return Object.entries(criteria).every(([key, value]) => {
    //             // Handle nested properties
    //             if (key.includes('.')) {
    //                 const [parent, child] = key.split('.');
    //                 return product[parent] && product[parent][child] === value;
    //             }
    //             // Handle direct properties
    //             return product[key] === value;
    //         });
    //     });
    // },

    // // Add a new product
    // addProduct: function (newProduct) {
    //     // Generate a new ID (simple increment for demo)
    //     const newId = this.products.length > 0 ?
    //         Math.max(...this.products.map(p => p.id)) + 1 : 1;

    //     const productToAdd = {
    //         id: newId,
    //         ...newProduct,
    //         // Ensure required fields have defaults
    //         images: newProduct.images || ['images/placeholder.png'],
    //         properties: newProduct.properties || {},
    //         stock: newProduct.stock || 0,
    //         rating: newProduct.rating || 0
    //     };

    //     this.products.push(productToAdd);
    //     return productToAdd;
    // },

    // // Update a product
    // updateProduct: function (id, updates) {
    //     const index = this.products.findIndex(product => product.id === id);
    //     if (index !== -1) {
    //         this.products[index] = {
    //             ...this.products[index],
    //             ...updates,
    //             // Don't allow ID to be changed
    //             id: this.products[index].id
    //         };
    //         return this.products[index];
    //     }
    //     return null;
    // },

    // // Delete a product
    // deleteProduct: function (id) {
    //     const index = this.products.findIndex(product => product.id === id);
    //     if (index !== -1) {
    //         return this.products.splice(index, 1)[0];
    //     }
    //     return null;
    // },

    // // Get products with discount
    // getDiscountedProducts: function () {
    //     return this.products.filter(product => product.discount && product.discount > 0);
    // },

    // // Get products with low stock (below threshold)
    // getLowStockProducts: function (threshold = 10) {
    //     return this.products.filter(product => product.stock < threshold);
    // },

    // // Get products sorted by price (asc or desc)
    // getProductsSortedByPrice: function (order = 'asc') {
    //     return [...this.products].sort((a, b) =>
    //         order === 'asc' ? a.price - b.price : b.price - a.price
    //     );
    // },

    // // Get unique brands
    // getUniqueBrands: function () {
    //     return [...new Set(this.products.map(product => product.brand))];
    // },

    // // Get unique categories
    // getUniqueCategories: function () {
    //     return [...new Set(this.products.map(product => product.category))];
    // }
};

if (typeof window !== 'undefined') {
    window.db = db;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = db;
}