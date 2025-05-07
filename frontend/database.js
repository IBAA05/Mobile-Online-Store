const db = {
    admins: [
        {
            id: 1,
            name: "user1",
            email: "admin@example.com",
            password: "admin123",
            status: "active",
            createdAt: "2023-01-01T00:00:00Z",
            lastLogin: "2023-06-15T00:00:00Z"
        },
        {
            id: 2,
            name: "user2",
            email: "wail@example.com",
            password: "secure456",
            status: "active",
            createdAt: "2023-02-15T00:00:00Z",
            lastLogin: "2023-06-10T00:00:00Z"
        },
        {
            id: 3,
            name: "user3",
            email: "mounder@example.com",
            password: "test123",
            status: "blocked",
            createdAt: "2023-03-20T00:00:00Z",
            lastLogin: "2023-04-01T00:00:00Z"
        }
    ],

    products: [
        {
            id: 1,
            title: "iPhone 16 Pro Max",
            brand: "Apple",
            discount: 10,
            images: ["images/iphone16pro-removebg-preview.png"],
            variants: [
                { storage: "256GB", price: 32000.00, stock: 15 },
                { storage: "512GB", price: 37000.00, stock: 10 },
                { storage: "1TB", price: 50000.00, stock: 20 }
            ]
        },
       
       
    ],

    getAllProducts: function () {
        // Flatten variants into separate products
        const allProducts = [];
        this.products.forEach(product => {
            product.variants.forEach(variant => {
                allProducts.push({
                    id: `${product.id}-${variant.storage}`,
                    parentId: product.id,
                    title: product.title,
                    brand: product.brand,
                    discount: product.discount,
                    images: product.images,
                    price: variant.price,
                    stock: variant.stock,
                    properties: {
                        storage: variant.storage
                    }
                });
            });
        });
        return allProducts;
    },

    getUniqueBrands: function () {
        const brands = new Set();
        this.products.forEach(product => brands.add(product.brand));
        return Array.from(brands);
    },

    getProductsByBrand: function (brand) {
        return this.getAllProducts().filter(product => product.brand === brand);
    },

    getProductsByPriceRange: function (minPrice, maxPrice) {
        return this.getAllProducts().filter(product => product.price >= minPrice && product.price <= maxPrice);
    },

    searchProducts: function (keyword) {
        const searchTerm = keyword.toLowerCase();
        return this.getAllProducts().filter(product => {
            return (
                product.title.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                (product.properties.storage && product.properties.storage.toLowerCase().includes(searchTerm))
            );
        });
    }
};

if (typeof window !== 'undefined') {
    window.db = db;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = db;
}
