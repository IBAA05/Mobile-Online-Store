<?php
require_once __DIR__ . '/../Controllers/AuthController.php';

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