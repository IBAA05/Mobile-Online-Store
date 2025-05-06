<?php
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$request = $_SERVER['REQUEST_URI'];
header('Access-Control-Allow-Origin: *'); 
header('Accesss-Control-Allow-Headers: Content-Type'); // Allow specific headers for CORS

switch ($request) {
    case '/api/products':
    case '/api/products/':
        require __DIR__ . '/api/products.php';
        break;

    case '/api/orders':
    case '/api/orders/':
        require __DIR__ . '/api/orders.php';
        break;

    // 👇 Ajout pour gérer les utilisateurs
    case '/api/users':
    case '/api/users/':
        require __DIR__ . '/api/users.php';
        break;

    default:
        // Handle API routes with parameters (like /api/products/1)
        if (preg_match('/^\/api\/products\/\d+$/', $request)) {
            require __DIR__ . '/api/products.php';
        } elseif (preg_match('/^\/api\/orders\/\d+$/', $request)) {
            require __DIR__ . '/api/orders.php';
        } elseif (preg_match('/^\/api\/orders\/[a-zA-Z\s]+$/', $request)) {
            require __DIR__ . '/api/orders.php';
        } else {
            http_response_code(404);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Endpoint not found']);
        }
        break;
}
?>
