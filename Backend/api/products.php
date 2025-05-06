<?php
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/AuthController.php';

// Update CORS headers to handle credentials properly
header('Access-Control-Allow-Origin: http://127.0.0.1:5501'); // Replace with your frontend origin
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);
$productId = isset($uri[3]) ? $uri[3] : null;

// Only authenticate for non-GET requests
if ($method !== 'GET') {
    try {
        AuthController::authenticate();
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized access']);
        exit();
    }
}

$controller = new ProductController();

switch ($method) {
    case 'GET':
        if ($productId) {
            $controller->getProduct($productId);
        } elseif (isset($_GET['search'])) {
            $controller->searchProducts($_GET['search']);
        } elseif (!empty($_GET)) {
            $controller->filterProducts();
        } else {
            $controller->getAllProducts();
        }
        break;
    case 'POST':
        $controller->createProduct();
        break;
    case 'PUT':
        if ($productId) {
            $controller->updateProduct($productId);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Product ID required']);
        }
        break;
    case 'DELETE':
        if ($productId) {
            $controller->deleteProduct($productId);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Product ID required']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>