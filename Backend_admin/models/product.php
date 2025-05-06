<?php
require_once __DIR__ . '/../utils/JsonHandler.php';

class Product {
    /**
     * Get all products
     * @return array List of all products
     */
    public static function getAll() {
        $data = JsonHandler::readJson('products.json');
        return $data['products'] ?? [];
    }
    
    /**
     * Get product by ID
     * @param int $id Product ID
     * @return array|null Product data or null if not found
     */
    public static function getById($id) {
        $products = self::getAll();
        foreach ($products as $product) {
            if ($product['id'] == $id) {
                return $product;
            }
        }
        return null;
    }
    
    /**
     * Create a new product
     * @param array $productData Product data
     * @return array Created product data
     */
    public static function create($productData) {
        $products = self::getAll();
        $newId = JsonHandler::getNextId($products);
        $productData['id'] = $newId;
        
        // Set default values if not provided
        if (!isset($productData['discount'])) {
            $productData['discount'] = 0;
        }
        if (!isset($productData['images'])) {
            $productData['images'] = [];
        }
        if (!isset($productData['variants'])) {
            $productData['variants'] = [];
        }
        
        $products[] = $productData;
        JsonHandler::writeJson('products.json', ['products' => $products]);
        return $productData;
    }
    
    /**
     * Update a product
     * @param int $id Product ID
     * @param array $productData Updated product data
     * @return array|null Updated product data or null if not found
     */
    public static function update($id, $productData) {
        $products = self::getAll();
        foreach ($products as &$product) {
            if ($product['id'] == $id) {
                $product = array_merge($product, $productData);
                JsonHandler::writeJson('products.json', ['products' => $products]);
                return $product;
            }
        }
        return null;
    }
    
    /**
     * Delete a product
     * @param int $id Product ID
     * @return bool True if deleted, false if not found
     */
    public static function delete($id) {
        $products = self::getAll();
        $newProducts = array_filter($products, function($product) use ($id) {
            return $product['id'] != $id;
        });
        JsonHandler::writeJson('products.json', ['products' => array_values($newProducts)]);
        return true;
    }
}
?>