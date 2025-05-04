<?php
require_once __DIR__ . '/../controllers/UserController.php';

$controller = new UserController();
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// Extract ID and action from URL
$userId = isset($uri[3]) ? $uri[3] : null;
$action = isset($uri[4]) ? $uri[4] : null;

switch ($method) {
    case 'GET':
        if ($userId) {
            $controller->getUser($userId);
        } else {
            $controller->getAllUsers();
        }
        break;
    case 'POST':
        $controller->createUser();
        break;
    case 'PUT':
        if ($userId) {
            $controller->updateUser($userId);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'User ID required']);
        }
        break;
    case 'DELETE':
        if ($userId) {
            $controller->deleteUser($userId);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'User ID required']);
        }
        break;
    case 'PATCH':
        if ($userId && $action === 'status') {
            $controller->changeUserStatus($userId);
        } elseif ($userId && $action === 'role') {
            $controller->changeUserRole($userId);
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