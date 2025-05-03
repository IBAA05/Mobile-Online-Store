<?php
require_once __DIR__ . '/../models/Order.php';

class OrderController {
    public function getAllOrders() {
        header('Content-Type: application/json');
        echo json_encode(Order::getAll());
    }
    
    public function getOrder($id) {
        header('Content-Type: application/json');
        $order = Order::getById($id);
        if ($order) {
            echo json_encode($order);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Order not found']);
        }
    }
    
    public function createOrder() {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['customer']) || empty($input['items'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }
        
        // Set default values
        $input['date'] = date('Y-m-d');
        $input['status'] = 'Pending';
        $input['total'] = array_reduce($input['items'], function($sum, $item) {
            return $sum + ($item['price'] * $item['quantity']);
        }, 0);
        
        $newOrder = Order::create($input);
        http_response_code(201);
        echo json_encode($newOrder);
    }
    
    public function updateOrderStatus($id) {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Status is required']);
            return;
        }
        
        $updatedOrder = Order::updateStatus($id, $input['status']);
        if ($updatedOrder) {
            echo json_encode($updatedOrder);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Order not found']);
        }
    }
    
    public function getCustomerOrders($customerName) {
        header('Content-Type: application/json');
        $orders = Order::getByCustomer($customerName);
        echo json_encode(array_values($orders));
    }
}
?>