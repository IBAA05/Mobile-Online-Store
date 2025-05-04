<?php
require_once __DIR__ . '/../utils/JsonHandler.php';

class Order {
    /**
     * Get all orders
     * @return array List of orders
     */
    public static function getAll() {
        $data = JsonHandler::readJson('orders.json');
        return $data['orders'] ?? [];
    }
    
    /**
     * Get order by ID
     * @param int $id Order ID
     * @return array|null Order data or null if not found
     */
    public static function getById($id) {
        $orders = self::getAll();
        foreach ($orders as $order) {
            if ($order['id'] == $id) {
                return $order;
            }
        }
        return null;
    }
    
    /**
     * Create new order
     * @param array $orderData Order data
     * @return array Created order
     */
    public static function create($orderData) {
        $orders = self::getAll();
        $newId = JsonHandler::getNextId($orders);
        
        $orderData['id'] = $newId;
        $orderData['date'] = date('Y-m-d');
        $orderData['status'] = 'Pending';
        $orderData['history'] = [
            [
                'status' => 'Pending',
                'date' => date('Y-m-d'),
                'notes' => 'Order received'
            ]
        ];
        
        // Calculate total
        $orderData['total'] = array_reduce($orderData['items'], function($sum, $item) {
            return $sum + ($item['price'] * $item['quantity']);
        }, 0);
        
        $orders[] = $orderData;
        JsonHandler::writeJson('orders.json', ['orders' => $orders]);
        return $orderData;
    }
    
    /**
     * Update order status
     * @param int $id Order ID
     * @param string $status New status
     * @param string $notes Optional notes
     * @return array|null Updated order or null if not found
     */
    public static function updateStatus($id, $status, $notes = '') {
        $orders = self::getAll();
        foreach ($orders as &$order) {
            if ($order['id'] == $id) {
                $order['status'] = $status;
                $order['history'][] = [
                    'status' => $status,
                    'date' => date('Y-m-d'),
                    'notes' => $notes
                ];
                JsonHandler::writeJson('orders.json', ['orders' => $orders]);
                return $order;
            }
        }
        return null;
    }
    
    /**
     * Get orders by customer
     * @param string $customerName Customer name
     * @return array Filtered orders
     */
    public static function getByCustomer($customerName) {
        $customerName = urldecode($customerName); // Decode URL-encoded characters
        return array_filter(self::getAll(), function($order) use ($customerName) {
            // Handle both string and object customer formats
            $orderCustomer = is_array($order['customer']) ? 
                            $order['customer']['name'] : 
                            $order['customer'];
            
            // Trim and compare case-insensitively
            return strcasecmp(trim($orderCustomer), trim($customerName)) === 0;
        });
    }
    
    /**
     * Export order history
     * @param int $id Order ID
     * @return string|null CSV formatted history or null if not found
     */
    public static function exportHistory($id) {
        $order = self::getById($id);
        if (!$order) return null;
        
        $csv = "Date,Status,Notes\n";
        foreach ($order['history'] as $entry) {
            $csv .= "{$entry['date']},{$entry['status']},\"{$entry['notes']}\"\n";
        }
        return $csv;
    }
}
?>