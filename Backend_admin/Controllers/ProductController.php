<?php
require_once __DIR__ . '/../models/Product.php';

class ProductController {
    /**
     * Get all products
     */
    public function getAllProducts() {
        header('Content-Type: application/json');
        echo json_encode(Product::getAll());
    }
    
    /**
     * Get a single product by ID
     * @param int $id Product ID
     */
    public function getProduct($id) {
        header('Content-Type: application/json');
        $product = Product::getById($id);
        if ($product) {
            echo json_encode($product);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
        }
    }
    
    /**
     * Create a new product
     */
    public function createProduct() {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (empty($input['title']) || empty($input['brand'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields (title, brand)']);
            return;
        }
        
        // Set default price from first variant if not provided
        if (empty($input['price']) && !empty($input['variants']) && count($input['variants']) > 0) {
            $input['price'] = $input['variants'][0]['price'];
        }
        
        $newProduct = Product::create($input);
        http_response_code(201);
        echo json_encode($newProduct);
    }
    
    /**
     * Update an existing product
     * @param int $id Product ID to update
     */
    public function updateProduct($id) {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        
        $updatedProduct = Product::update($id, $input);
        if ($updatedProduct) {
            echo json_encode($updatedProduct);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
        }
    }
    
    /**
     * Delete a product
     * @param int $id Product ID to delete
     */
    public function deleteProduct($id) {
        header('Content-Type: application/json');
        if (Product::delete($id)) {
            echo json_encode(['message' => 'Product deleted']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
        }
    }
    
    /**
     * Search products by title or brand
     * @param string $query Search query
     */
    public function searchProducts($query) {
        header('Content-Type: application/json');
        $products = Product::getAll();
        $filteredProducts = array_filter($products, function($product) use ($query) {
            return stripos($product['title'], $query) !== false || 
                   stripos($product['brand'], $query) !== false;
        });
        echo json_encode(array_values($filteredProducts));
    }
    
    /**
     * Filter products by brand, price range, or discount
     */
    public function filterProducts() {
        header('Content-Type: application/json');
        $filters = $_GET;
        $products = Product::getAll();
        
        $filteredProducts = array_filter($products, function($product) use ($filters) {
            $match = true;
            
            // Filter by brand
            if (isset($filters['brand']) && $product['brand'] != $filters['brand']) {
                $match = false;
            }
            
            // Filter by price range (use first variant price if product price not set)
            $productPrice = $product['price'] ?? ($product['variants'][0]['price'] ?? 0);
            
            if (isset($filters['minPrice']) && $productPrice < $filters['minPrice']) {
                $match = false;
            }
            
            if (isset($filters['maxPrice']) && $productPrice > $filters['maxPrice']) {
                $match = false;
            }
            
            // Filter by discount range
            $productDiscount = $product['discount'] ?? 0;
            
            if (isset($filters['minDiscount']) && $productDiscount < $filters['minDiscount']) {
                $match = false;
            }
            
            if (isset($filters['maxDiscount']) && $productDiscount > $filters['maxDiscount']) {
                $match = false;
            }
            
            return $match;
        });
        
        echo json_encode(array_values($filteredProducts));
    }
}
?>