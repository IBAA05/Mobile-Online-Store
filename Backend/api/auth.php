<?php
require_once __DIR__ . '/../controllers/AuthController.php';

header('Access-Control-Allow-Origin: http://127.0.0.1:5501');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

try {
    $controller = new AuthController();
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';

    switch ($method) {
        case 'POST':
            if ($action === 'login') {
                $controller->login();
            } elseif ($action === 'logout') {
                $controller->logout();
            } else {
                throw new Exception('Invalid action', 400);
            }
            break;
        case 'GET':
            if ($action === 'check') {
                $controller->checkAuth();
            } else {
                throw new Exception('Invalid action', 400);
            }
            break;
        default:
            throw new Exception('Method not allowed', 405);
    }
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>