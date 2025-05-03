<?php
require_once __DIR__ . '/../models/Product.php';

class ProductController {
    public function getAllProducts() {
        header('Content-Type: application/json');
        echo json_encode(Product::getAll());
    }
    
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
    
    public function createProduct() {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['name']) || empty($input['price']) || empty($input['brand'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }
        
        $newProduct = Product::create($input);
        http_response_code(201);
        echo json_encode($newProduct);
    }
    
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
    
    public function deleteProduct($id) {
        header('Content-Type: application/json');
        if (Product::delete($id)) {
            echo json_encode(['message' => 'Product deleted']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
        }
    }
}
?>