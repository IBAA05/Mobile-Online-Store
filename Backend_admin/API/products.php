<?php
require_once __DIR__ . '/../controllers/ProductController.php';
// For any authenticated user
require_once __DIR__ . '/../controllers/AuthController.php';
AuthController::authenticate();

// For admin-only routes
AuthController::authenticate('admin');

$controller = new ProductController();
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);
$productId = isset($uri[3]) ? $uri[3] : null;

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