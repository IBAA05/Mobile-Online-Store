<?php
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../controllers/AuthController.php';

header('Access-Control-Allow-Origin: http://127.0.0.1:5501');  // Modified to match frontend origin exactly
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Example of returning JSON data
header('Content-Type: application/json');

$controller = new UserController();
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// Extract ID and action from URL
$userId = isset($uri[3]) ? $uri[3] : null;
$action = isset($uri[4]) ? $uri[4] : null;

// Authentication logic
try {
    // For viewing a single user profile, only require authentication
    if ($method === 'GET' && $userId && !$action) {
        AuthController::authenticate();
    } 
    // For all other routes, require admin privileges
    else {
        AuthController::authenticate('admin');
    }
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 401);
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}

// Route handling
switch ($method) {
    case 'GET':
        if ($userId && !$action) {
            $controller->getUser($userId);
        } else if (!$userId && !$action) {
            $controller->getAllUsers();
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid request']);
        }
        break;
        
    case 'POST':
        if (!$userId && !$action) {
            $controller->createUser();
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid request']);
        }
        break;
        
    case 'PUT':
        if ($userId && !$action) {
            $controller->updateUser($userId);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'User ID required']);
        }
        break;
        
    case 'DELETE':
        if ($userId && !$action) {
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