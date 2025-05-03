<?php
require_once __DIR__ . '/../utils/JsonHandler.php';

class Product {
    public static function getAll() {
        $data = JsonHandler::readJson('products.json');
        return $data['products'] ?? [];
    }
    
    public static function getById($id) {
        $products = self::getAll();
        foreach ($products as $product) {
            if ($product['id'] == $id) {
                return $product;
            }
        }
        return null;
    }
    
    public static function create($productData) {
        $products = self::getAll();
        $newId = JsonHandler::getNextId($products);
        $productData['id'] = $newId;
        $products[] = $productData;
        JsonHandler::writeJson('products.json', ['products' => $products]);
        return $productData;
    }
    
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