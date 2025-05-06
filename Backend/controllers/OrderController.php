<?php
require_once __DIR__ . '/../models/order.php';

class OrderController {
    /**
     * Get all orders
     */
    public function getAllOrders() {
        header('Content-Type: application/json');
        echo json_encode(Order::getAll());
    }
    
    /**
     * Get single order
     * @param int $id Order ID
     */
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
    
    /**
     * Create new order
     */
    public function createOrder() {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['customer']['name']) || empty($input['items'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }
        
        $newOrder = Order::create($input);
        http_response_code(201);
        echo json_encode($newOrder);
    }
    
    /**
     * Update order status
     * @param int $id Order ID
     */
    public function updateOrderStatus($id) {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Status is required']);
            return;
        }
        
        $notes = $input['notes'] ?? '';
        $updatedOrder = Order::updateStatus($id, $input['status'], $notes);
        
        if ($updatedOrder) {
            echo json_encode($updatedOrder);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Order not found']);
        }
    }
    
    /**
     * Get customer orders
     * @param string $customerName Customer name
     */
    public function getCustomerOrders($customerName) {
        header('Content-Type: application/json');
        $orders = Order::getByCustomer($customerName);
        echo json_encode(array_values($orders));
    }
    
    /**
     * Export order history
     * @param int $id Order ID
     */
    public function exportOrderHistory($id) {
        $csv = Order::exportHistory($id);
        if ($csv) {
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="order_' . $id . '_history.csv"');
            echo $csv;
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Order not found']);
        }
    }
}
?>