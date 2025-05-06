<?php
require_once __DIR__ . '/../controllers/OrderController.php';
// For any authenticated user
require_once __DIR__ . '/../controllers/AuthController.php';
header('Access-Control-Allow-Origin: http://127.0.0.1:5501');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Example of returning JSON data
header('Content-Type: application/json');



AuthController::authenticate();


$controller = new OrderController();
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// Extract parameters
$param = $uri[3] ?? null;
$action = $uri[4] ?? null;

switch ($method) {
    case 'GET':
        if ($param && is_numeric($param)) {
            if ($action === 'export') {
                $controller->exportOrderHistory($param);
            } else {
                $controller->getOrder($param);
            }
        } elseif ($param) {
            $controller->getCustomerOrders($param);
        } else {
            $controller->getAllOrders();
        }
        break;
    case 'POST':
        $controller->createOrder();
        break;
    case 'PUT':
        if ($param && is_numeric($param)) {
            $controller->updateOrderStatus($param);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Order ID required']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>