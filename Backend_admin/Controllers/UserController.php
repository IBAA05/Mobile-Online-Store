<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../controllers/AuthController.php';

class UserController {
    public function getAllUsers() {
        AuthController::authenticate('admin');
        header('Content-Type: application/json');
        echo json_encode(User::getAll());
    }
    
    public function getUser($id) {
        $auth = AuthController::authenticate();
        // Users can only view their own profile unless admin
        if ($auth['id'] != $id && $auth['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }
        
        header('Content-Type: application/json');
        try {
            $user = User::getById($id);
            if ($user) {
                // Don't return password hash
                unset($user['password']);
                echo json_encode($user);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'User not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function createUser() {
        header('Content-Type: application/json');
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $newUser = User::create($input);
            
            // Don't return password hash
            unset($newUser['password']);
            
            http_response_code(201);
            echo json_encode($newUser);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function updateUser($id) {
        $auth = AuthController::authenticate();
        // Users can only update their own profile unless admin
        if ($auth['id'] != $id && $auth['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }
        
        header('Content-Type: application/json');
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $updatedUser = User::update($id, $input);
            
            // Don't return password hash
            unset($updatedUser['password']);
            
            echo json_encode($updatedUser);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function deleteUser($id) {
        AuthController::authenticate('admin');
        header('Content-Type: application/json');
        try {
            User::delete($id);
            echo json_encode(['message' => 'User deleted successfully']);
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function changeUserStatus($id) {
        AuthController::authenticate('admin');
        header('Content-Type: application/json');
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $user = User::changeStatus($id, $input['status']);
            
            // Don't return password hash
            unset($user['password']);
            
            echo json_encode($user);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function changeUserRole($id) {
        AuthController::authenticate('admin');
        header('Content-Type: application/json');
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $user = User::changeRole($id, $input['role']);
            
            // Don't return password hash
            unset($user['password']);
            
            echo json_encode($user);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>