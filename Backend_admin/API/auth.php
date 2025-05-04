<?php
require_once __DIR__ . '/../controllers/AuthController.php';

$controller = new AuthController();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $action = $_GET['action'] ?? '';
        if ($action === 'login') {
            $controller->login();
        } elseif ($action === 'signup') {
            $controller->signup();
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>