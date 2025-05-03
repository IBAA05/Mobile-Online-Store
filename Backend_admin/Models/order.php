<?php
require_once __DIR__ . '/../utils/JsonHandler.php';

class Order {
    public static function getAll() {
        $data = JsonHandler::readJson('orders.json');
        return $data['orders'] ?? [];
    }
    
    public static function getById($id) {
        $orders = self::getAll();
        foreach ($orders as $order) {
            if ($order['id'] == $id) {
                return $order;
            }
        }
        return null;
    }
    
    public static function create($orderData) {
        $orders = self::getAll();
        $newId = JsonHandler::getNextId($orders);
        $orderData['id'] = $newId;
        $orders[] = $orderData;
        JsonHandler::writeJson('orders.json', ['orders' => $orders]);
        return $orderData;
    }
    
    public static function updateStatus($id, $status) {
        $orders = self::getAll();
        foreach ($orders as &$order) {
            if ($order['id'] == $id) {
                $order['status'] = $status;
                JsonHandler::writeJson('orders.json', ['orders' => $orders]);
                return $order;
            }
        }
        return null;
    }
    
    public static function getByCustomer($customerName) {
        return array_filter(self::getAll(), function($order) use ($customerName) {
            return strtolower($order['customer']) === strtolower($customerName);
        });
    }
}
?>